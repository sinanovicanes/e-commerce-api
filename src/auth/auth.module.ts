import { UserModelDefinition } from '@/user/schemas';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { RefreshTokenDefinition, ResetTokenDefinition } from './schemas';
import { GoogleStrategy, LocalStrategy } from './strategies';
import { GoogleAuthController } from './auth-google.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      UserModelDefinition,
      RefreshTokenDefinition,
      ResetTokenDefinition,
    ]),
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
