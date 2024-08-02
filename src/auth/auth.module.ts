import { UserModelDefinition } from '@/user/schemas';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { RefreshTokenDefinition, ResetTokenDefinition } from './schemas';
import { LocalStrategy } from './strategies';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      UserModelDefinition,
      RefreshTokenDefinition,
      ResetTokenDefinition,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
