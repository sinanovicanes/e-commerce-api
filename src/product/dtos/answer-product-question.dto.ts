import { IsString, Length } from 'class-validator';

export class AnswerProductQuestionDto {
  @IsString()
  @Length(5, 2000)
  answer: string;
}
