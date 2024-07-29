import { UserModelDefinition } from '@/user/schemas/User';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([UserModelDefinition])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
