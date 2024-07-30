import { EncryptionService } from '@/encryption/encryption.service';
import { User } from '@/user/schemas/User';
import { hours } from '@/utils/date';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  @Inject() private readonly encryptionService: EncryptionService;
  @Inject() private readonly jwtService: JwtService;
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async signUp(signUpDto: SignUpDto) {
    const { password } = signUpDto;
    const hashedPassword = await this.encryptionService.hash(password);
    const user = new this.userModel({ ...signUpDto, password: hashedPassword });

    try {
      await user.save();
    } catch {
      throw new HttpException(
        'This username or email is already exist.',
        HttpStatus.CONFLICT,
      );
    }

    return this.generateUserTokens(user);
  }

  async signIn(signInDto: SignInDto) {
    const { username, email, password } = signInDto;

    if (!username && !email) {
      throw new HttpException(
        'Username or email is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!!username && !!email) {
      throw new HttpException(
        'You can only use one field: username or email',
        HttpStatus.BAD_REQUEST,
      );
    }

    // LOOKS UGLY BUT DOES THE JOB
    const user = !!username
      ? await this.userModel.findOne({ username })
      : await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return this.generateUserTokens(user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      return null;
    }

    const isValidPassword = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async generateUserTokens(user: User) {
    const accessToken = this.jwtService.sign({ sub: user._id });

    return { accessToken };
  }

  async setUserTokensToCookie(user: User, res: Response) {
    const { accessToken } = await this.generateUserTokens(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: hours(1),
    });
  }
}
