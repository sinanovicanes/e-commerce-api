import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressInfoDto {
  @ApiProperty()
  @IsString()
  contactName: string;
  @ApiProperty()
  @IsString()
  city: string;
  @ApiProperty()
  @IsString()
  country: string;
  @ApiProperty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  zipCode: string;
}
