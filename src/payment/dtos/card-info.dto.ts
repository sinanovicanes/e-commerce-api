import { IsBoolean, IsString, Length } from 'class-validator';

export class CardInfoDto {
  @IsString()
  cardHolderName: string;
  @IsString()
  cardNumber: string;
  @IsString()
  @Length(1, 2)
  expireMonth: string;
  @IsString()
  @Length(4, 4)
  expireYear: string;
  @IsString()
  @Length(3, 3)
  cvc: string;
  @IsString()
  cardAlias: string;
  @IsBoolean()
  registerCard: boolean;
}
