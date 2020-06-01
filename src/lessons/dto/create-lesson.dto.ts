import { IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  language_a: string;

  @IsString()
  language_b: string;
}
