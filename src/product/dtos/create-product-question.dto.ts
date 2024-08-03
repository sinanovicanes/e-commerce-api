import { IsMongoId, IsString, Length } from 'class-validator';

export class CreateProductQuestionDto {
  @IsString()
  @Length(5, 2000)
  question: string;
}
