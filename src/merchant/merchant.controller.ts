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
import { Request } from 'express';
import { Types } from 'mongoose';
import { GetMerchant } from './decorators';
import { CreateMerchantDto, UpdateMerchantDto } from './dtos';
import { MerchantOwnerGuard } from './guards';
import { MerchantAccessGuard } from './guards/merchant-access.guard';
import { MerchantService } from './merchant.service';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Public()
  @Get(':id')
  getMerchants(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.merchantService.getMerchantById(id);
  }

  @Post()
  createMerchant(
    @Body() createMerchantDto: CreateMerchantDto,
    @GetUser() user: User,
  ) {
    return this.merchantService.createMerchant(createMerchantDto, user);
  }

  @UseGuards(MerchantAccessGuard)
  @Patch()
  updateMerchant(
    @GetMerchant('_id') id: Types.ObjectId,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    return this.merchantService.updateMerchant(id, updateMerchantDto);
  }

  @UseGuards(MerchantOwnerGuard)
  @Get('users')
  getUsers(@GetMerchant('_id') id: Types.ObjectId) {
    return this.merchantService.getUsersByMerchantId(id);
  }

  @UseGuards(MerchantOwnerGuard)
  @Post('users')
  addUser(
    @GetMerchant('_id') id: Types.ObjectId,
    @Req() req: Request & { targetUser: User },
  ) {
    return this.merchantService.addUserToMerchant(id, req.targetUser as User);
  }

  @UseGuards(MerchantOwnerGuard)
  @Delete('users/:userId')
  updateUserRole(
    @GetMerchant('_id') id: Types.ObjectId,
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.merchantService.removeUserFromMerchant(id, userId);
  }
}
