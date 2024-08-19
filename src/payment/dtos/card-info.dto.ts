import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Length } from 'class-validator';

export class CardInfoDto {
  @ApiProperty()
  @IsString()
  cardHolderName: string;
  @ApiProperty()
  @IsString()
  cardNumber: string;
  @ApiProperty()
  @IsString()
  @Length(1, 2)
  expireMonth: string;
  @ApiProperty()
  @IsString()
  @Length(4, 4)
  expireYear: string;
  @ApiProperty()
  @IsString()
  @Length(3, 3)
  cvc: string;
  @ApiProperty()
  @IsString()
  cardAlias: string;
  @ApiProperty()
  @IsBoolean()
  registerCard: boolean;
}
