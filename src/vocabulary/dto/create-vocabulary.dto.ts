import { IsString, IsNumber } from 'class-validator';

export class CreateVocabularyDto {
  @IsString()
  language_a: string;

  @IsString()
  language_b: string;

  @IsNumber()
  lesson: number;
}
