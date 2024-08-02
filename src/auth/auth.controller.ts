import { User } from '@/user/schemas/User';
import { GetUser } from '@/utils/decorators';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard, ResetTokenGuard } from './guards';
import { Public } from './decorators';
import { ResetPasswordDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@GetUser() user: User, @Res() res: Response) {
    await this.authService.setUserTokensInCookies(user, res);

    return res.send(user);
  }

  @Post('sign-out')
  async signOut(@Res() res: Response) {
    this.authService.clearUserTokensFromCookies(res);

    return res.send({ message: 'Successfully signed out' });
  }

  @Public()
  @UseGuards(ResetTokenGuard)
  @Post('reset-password/:token')
  async resetPassword(
    @GetUser() user: User,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, resetPasswordDto);
  }
}
