import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateProductQuestionDto {
  @ApiProperty()
  @IsString()
  @Length(5, 2000)
  question: string;
}
