import { UserModelDefinition } from '@/user/schemas/User';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy, JwtStrategy } from './strategies';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([UserModelDefinition]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
