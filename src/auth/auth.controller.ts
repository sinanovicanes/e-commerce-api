import { User } from '@/user/schemas/User';
import { GetUser } from '@/utils/decorators';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard, ResetTokenGuard } from './guards';
import { Public } from './decorators';
import { ResetPasswordDto, ResetPasswordRequestDto } from './dtos';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User signed up' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOkResponse({ description: 'User signed in' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@GetUser() user: User, @Res() res: Response) {
    await this.authService.setUserTokensInCookies(user, res);

    return res.send(user);
  }

  @ApiOkResponse({ description: 'User signed out' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post('sign-out')
  async signOut(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(user, res);
  }

  @ApiOkResponse({ description: 'Password reset request sent' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Public()
  @Post('reset-password-request')
  async forgotPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return this.authService.forgotPassword(resetPasswordRequestDto);
  }

  @ApiOkResponse({ description: 'Password reset' })
  @ApiForbiddenResponse({ description: 'Invalid token' })
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
