import { IsString } from 'class-validator';

export class AddressInfoDto {
  @IsString()
  contactName: string;
  @IsString()
  city: string;
  @IsString()
  country: string;
  @IsString()
  address: string;
  @IsString()
  zipCode: string;
}
