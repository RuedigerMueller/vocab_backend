import { IsString } from 'class-validator';

export class UpdateLessonDto {
  @IsString()
  title: string;

  @IsString()
  language_a: string;

  @IsString()
  language_b: string;
}
