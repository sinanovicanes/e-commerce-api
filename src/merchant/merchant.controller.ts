import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Public } from '@/auth/decorators';
import { CreateMerchantDto } from './dtos';
import { GetUser } from '@/utils/decorators';
import { User } from '@/user/schemas';
import { ParseObjectIdPipe } from '@/utils/pipes';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Public()
  @Get(':id')
  getMerchants(@Param('id', ParseObjectIdPipe) id: string) {
    return this.merchantService.getMerchantById(id);
  }

  @Post('create')
  createMerchant(
    @Body() createMerchantDto: CreateMerchantDto,
    @GetUser() user: User,
  ) {
    return this.merchantService.createMerchant(createMerchantDto, user);
  }
}
