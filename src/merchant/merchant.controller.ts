import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Public } from '@/auth/decorators';
import { CreateMerchantDto, UpdateMerchantDto } from './dtos';
import { GetUser } from '@/utils/decorators';
import { User } from '@/user/schemas';
import { ParseObjectIdPipe } from '@/utils/pipes';
import { MerchantAccessGuard } from './guards/merchant-access.guard';
import { Types } from 'mongoose';
import { GetMerchant } from './decorators';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Public()
  @Get(':id')
  getMerchants(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.merchantService.getMerchantById(id);
  }

  @Post('create')
  createMerchant(
    @Body() createMerchantDto: CreateMerchantDto,
    @GetUser() user: User,
  ) {
    return this.merchantService.createMerchant(createMerchantDto, user);
  }

  @UseGuards(MerchantAccessGuard)
  @Patch('update')
  updateMerchant(
    @GetMerchant('_id') id: Types.ObjectId,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    return this.merchantService.updateMerchant(id, updateMerchantDto);
  }
}
