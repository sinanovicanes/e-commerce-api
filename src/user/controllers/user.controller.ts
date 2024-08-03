import { GetUser } from '@/utils/decorators';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateUserDto } from '../dtos';
import { User } from '../schemas';
import { UserService } from '../services';

@Controller('users')
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
