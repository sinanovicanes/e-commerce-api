import { UserModelDefinition } from '@/user/schemas';
import { UserModule } from '@/user/user.module';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenDefinition } from './schemas';
import { LocalStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([UserModelDefinition, RefreshTokenDefinition]),
    UserModule,
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
