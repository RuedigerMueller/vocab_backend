import { IsInt, IsString } from 'class-validator';

export class UpdateVocabularyDto {
  @IsString()
  language_a: string;

  @IsString()
  language_b: string;

  @IsInt()
  level: number;
}
