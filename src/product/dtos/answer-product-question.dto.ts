import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AnswerProductQuestionDto {
  @ApiProperty()
  @IsString()
  @Length(5, 2000)
  answer: string;
}
