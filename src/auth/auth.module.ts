import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from '@/user/schemas/User';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    MongooseModule.forFeature([UserModelDefinition]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
