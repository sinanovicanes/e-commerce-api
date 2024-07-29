import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/auth/guards/JwtAuthGuard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from '@/utils/decorators';
import { User } from './schemas/User';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(user, updateUserDto);
  }
}
