import { Public } from '@/auth/decorators';
import { User } from '@/user/schemas';
import { GetUser } from '@/utils/decorators';
import { ParseObjectIdPipe } from '@/utils/pipes';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';
import { GetMerchant } from './decorators';
import { CreateMerchantDto, UpdateMerchantDto } from './dtos';
import { MerchantOwnerGuard } from './guards';
import { MerchantAccessGuard } from './guards/merchant-access.guard';
import { MerchantService } from './merchant.service';
import { Merchant } from './schemas';

@ApiTags('merchants')
@ApiCookieAuth()
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @ApiOkResponse({ description: 'List of merchants', type: [Merchant] })
  @Public()
  @Get(':id')
  getMerchants(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.merchantService.getMerchantById(id);
  }

  @ApiCreatedResponse({ description: 'Merchant created', type: Merchant })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Merchant already exists' })
  @Post()
  createMerchant(
    @Body() createMerchantDto: CreateMerchantDto,
    @GetUser() user: User,
  ) {
    return this.merchantService.createMerchant(createMerchantDto, user);
  }

  @ApiHeader({ name: 'x-merchant-id', required: true })
  @ApiOkResponse({ description: 'Merchant updated', type: Merchant })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(MerchantAccessGuard)
  @Patch()
  updateMerchant(
    @GetMerchant('_id') id: Types.ObjectId,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    return this.merchantService.updateMerchant(id, updateMerchantDto);
  }

  @ApiOkResponse({ description: 'List of users', type: [User] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiHeader({ name: 'x-merchant-id', required: true })
  @UseGuards(MerchantOwnerGuard)
  @Get('users')
  getUsers(@GetMerchant('_id') id: Types.ObjectId) {
    return this.merchantService.getUsersByMerchantId(id);
  }

  @ApiOkResponse({ description: 'User added to merchant', type: Merchant })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiHeader({ name: 'x-merchant-id', required: true })
  @UseGuards(MerchantOwnerGuard)
  @Post('users')
  addUser(
    @GetMerchant('_id') id: Types.ObjectId,
    @Req() req: Request & { targetUser: User },
  ) {
    return this.merchantService.addUserToMerchant(id, req.targetUser as User);
  }

  @ApiOkResponse({ description: 'User removed from merchant', type: Merchant })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiHeader({ name: 'x-merchant-id', required: true })
  @UseGuards(MerchantOwnerGuard)
  @Delete('users/:userId')
  removeUser(
    @GetMerchant('_id') id: Types.ObjectId,
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.merchantService.removeUserFromMerchant(id, userId);
  }
}
