import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/user/schemas/User';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async signUp(signUpDto: SignUpDto) {
    const { password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ ...signUpDto, password: hashedPassword });

    try {
      await user.save();
    } catch {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
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

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return this.generateUserTokens(user);
  }

  async generateUserTokens(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user._id },
      { expiresIn: '1h' },
    );

    return { accessToken };
  }
}
