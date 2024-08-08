import { User } from '@/user/schemas/User';
import { GetUser } from '@/utils/decorators';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard, ResetTokenGuard } from './guards';
import { Public } from './decorators';
import { ResetPasswordDto, ResetPasswordRequestDto } from './dtos';

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
  async signOut(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(user, res);
  }

  @Public()
  @Post('reset-password-request')
  async forgotPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return this.authService.forgotPassword(resetPasswordRequestDto);
  }

  @Public()
  @UseGuards(ResetTokenGuard)
  @Post('reset-password')
  async resetPassword(
    @GetUser() user: User,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, resetPasswordDto);
  }
}
