import { IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  user: string;

  @IsString()
  title: string;

  @IsString()
  language_a: string;

  @IsString()
  language_b: string;
}
