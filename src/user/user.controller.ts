import { JwtAuthGuard } from '@/auth/guards';
import { GetUser } from '@/utils/decorators';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/User';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Patch()
  async update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(user, updateUserDto);
  }
}
