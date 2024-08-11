import { UserService } from '@/user/services';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthStrategies } from '../enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  @Inject() private readonly userService: UserService;

  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.userService.getOrCreateUser({
      email: profile.emails[0].value,
      username: profile.displayName,
      name: profile.name.givenName,
      lastname: profile.name.familyName,
      avatar: profile.photos[0].value,
      strategy: AuthStrategies.GOOGLE,
      password: '',
    });

    return user;
  }
}
