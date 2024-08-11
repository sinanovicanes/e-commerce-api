import { User } from '@/user/schemas/User';
import { GetUser } from '@/utils/decorators';
import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { GoogleAuthGuard } from './guards';

@Public()
@UseGuards(GoogleAuthGuard)
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async login() {}

  @Get('redirect')
  async redirect(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.setUserTokensInCookies(user, res);
    return { message: 'User authenticated with google' };
  }
}
