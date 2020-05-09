import { Injectable } from '@nestjs/common';
import { Lesson } from './lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Vocabulary } from 'src/vocabulary/vocabulary.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private _lessonRepository: Repository<Lesson>,
  ) {}

  async findAll(): Promise<Lesson[]> {
    return this._lessonRepository.find();
  }

  async findOne(id: string): Promise<Lesson> {
    return this._lessonRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this._lessonRepository.delete(id);
  }

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const lesson = new Lesson();
    lesson.user = createLessonDto.user;
    lesson.title = createLessonDto.title;
    lesson.language_a = createLessonDto.language_a;
    lesson.language_b = createLessonDto.language_b;

    return await this._lessonRepository.save(lesson);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<void> {
    const lesson = new Lesson();
    (lesson.title = updateLessonDto.title),
      (lesson.language_a = updateLessonDto.language_a);
    lesson.language_b = updateLessonDto.language_b;

    await this._lessonRepository.update(id, lesson);
  }
}
