import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private _lessonRepository: Repository<Lesson>,
  ) { }

  async findAll(user: User): Promise<Lesson[]> {
    return this._lessonRepository.find({ where: { user: user } });
  }

  async findOne(id: string, user: User): Promise<Lesson> {
    return this._lessonRepository.findOne({ where: { id: id, user: user } });
  }

  async remove(id: string, user: User): Promise<void> {
    const lesson: Lesson = await this.findOne(id, user);
    if (lesson) await this._lessonRepository.delete(id);
  }

  async create(createLessonDto: CreateLessonDto, user: User): Promise<Lesson> {
    const lesson: Lesson = new Lesson();

    lesson.user = user
    lesson.title = createLessonDto.title;
    lesson.language_a = createLessonDto.language_a;
    lesson.language_b = createLessonDto.language_b;

    return await this._lessonRepository.save(lesson);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, user: User): Promise<void> {
    const lesson: Lesson = await this.findOne(id, user);
    if (lesson) {
      lesson.title = updateLessonDto.title;
      lesson.language_a = updateLessonDto.language_a;
      lesson.language_b = updateLessonDto.language_b;

      await this._lessonRepository.update(id, lesson);
    }
  }
}
