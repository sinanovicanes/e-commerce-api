import { GetUser } from '@/utils/decorators';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateUserDto } from '../dtos';
import { User } from '../schemas';
import { UserService } from '../services';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'Get current user details', type: User })
  @Get()
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @ApiOkResponse({
    description: 'User details updated successfully',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @Patch()
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user, updateUserDto);
  }
}
