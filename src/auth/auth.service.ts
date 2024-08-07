import { EncryptionService } from '@/encryption/encryption.service';
import { User } from '@/user/schemas/User';
import { adjustDate, minutes, weeks } from '@/utils/date';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import {
  ResetPasswordDto,
  ResetPasswordRequestDto,
  SignInDto,
  SignUpDto,
} from './dtos';
import { CookieFields } from './enums';
import { RefreshToken, ResetToken } from './schemas';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserRegisterEvent,
  UserSignedOutEvent,
  UserResetPasswordEvent,
  UserResetPasswordRequestEvent,
} from './events';

@Injectable()
export class AuthService {
  @Inject() private readonly encryptionService: EncryptionService;
  @Inject() private readonly jwtService: JwtService;
  @Inject() private readonly configService: ConfigService;
  @Inject() private readonly eventEmitter: EventEmitter2;
  @InjectModel(User.name) private readonly userModel: Model<User>;
  @InjectModel(RefreshToken.name)
  private readonly refreshTokenModel: Model<RefreshToken>;
  @InjectModel(ResetToken.name)
  private readonly resetTokenModel: Model<ResetToken>;

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

    this.eventEmitter.emit(
      UserRegisterEvent.eventName,
      UserRegisterEvent.fromUser(user),
    );

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

  async signOut(user: User, res: Response) {
    this.clearUserTokensFromCookies(res);

    this.eventEmitter.emit(
      UserSignedOutEvent.eventName,
      UserSignedOutEvent.fromUser(user),
    );

    return { message: 'User has been signed out' };
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

  async generateRefreshToken(user: User) {
    const refreshToken = this.jwtService.sign(
      { sub: user._id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      },
    );

    const token = await this.encryptionService.hash(refreshToken);
    const expiresAt = adjustDate({
      weeks: 1,
    });

    await this.refreshTokenModel.replaceOne(
      {
        user: user._id,
      },
      {
        token,
        user: user._id,
        expiresAt,
      },
      {
        upsert: true,
      },
    );

    return refreshToken;
  }

  async validateRefreshToken(user: User, refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({ user: user._id });

    if (!token) {
      return false;
    }

    if (token.expiresAt < new Date()) {
      return false;
    }

    const isValidToken = await this.encryptionService.compare(
      refreshToken,
      token.token,
    );

    if (!isValidToken) {
      return false;
    }

    return true;
  }

  async generateUserTokens(user: User) {
    const accessToken = this.jwtService.sign({ sub: user._id });
    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async setUserTokensInCookies(user: User, res: Response) {
    const { accessToken, refreshToken } = await this.generateUserTokens(user);

    res.cookie(CookieFields.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: minutes(15, true),
    });

    res.cookie(CookieFields.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: weeks(1, true),
    });
  }

  clearUserTokensFromCookies(res: Response) {
    res.clearCookie(CookieFields.ACCESS_TOKEN);
    res.clearCookie(CookieFields.REFRESH_TOKEN);
  }

  async generateResetToken(user: User) {
    const resetToken = this.jwtService.sign(
      {
        sub: user._id,
      },
      {
        secret: this.configService.get('JWT_RESET_SECRET'),
        expiresIn: this.configService.get('JWT_RESET_EXPIRATION'),
      },
    );

    const token = await this.encryptionService.hash(resetToken);
    const expiresAt = adjustDate({ minutes: 30 });

    await this.resetTokenModel.replaceOne(
      {
        user: user._id,
      },
      {
        token,
        user: user._id,
        expiresAt,
      },
      {
        upsert: true,
      },
    );

    return resetToken;
  }

  async validateResetToken(target: User | Types.ObjectId, resetToken: string) {
    const user = target instanceof Types.ObjectId ? target : target._id;
    const resetTokenDoc = await this.resetTokenModel.findOne({ user });

    if (!resetTokenDoc) {
      return false;
    }

    if (resetTokenDoc.expiresAt < new Date()) {
      return false;
    }

    const isValidToken = await this.encryptionService.compare(
      resetToken,
      resetTokenDoc.token,
    );

    return isValidToken;
  }

  async forgotPassword(resetPasswordRequestDto: ResetPasswordRequestDto) {
    const { email } = resetPasswordRequestDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = await this.generateResetToken(user);

    this.eventEmitter.emit(
      UserResetPasswordRequestEvent.eventName,
      new UserResetPasswordRequestEvent(user, resetToken),
    );

    return { message: 'Reset password mail sended to your email address' };
  }

  async resetPassword(user: User, resetPasswordDto: ResetPasswordDto) {
    const { password } = resetPasswordDto;
    const hashedPassword = await this.encryptionService.hash(password);

    await this.userModel.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
      },
    );

    await this.resetTokenModel.deleteOne({ user: user._id });

    this.eventEmitter.emit(
      UserResetPasswordEvent.eventName,
      UserResetPasswordEvent.fromUser(user),
    );

    return { message: 'Password has been reset' };
  }
}
