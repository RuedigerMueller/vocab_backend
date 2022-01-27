import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonsService {
  private readonly _logger = new Logger(LessonsService.name);

  constructor(
    @InjectRepository(Lesson)
    private _lessonRepository: Repository<Lesson>,
  ) { }

  async findAll(user: User): Promise<Lesson[]> {
    this._logger.log(`findAll: user = ${ JSON.stringify(user) }`);
    return this._lessonRepository.find({ where: { user: user } });
  }

  async findOne(id: string, user: User): Promise<Lesson> {
    this._logger.log(`findOne: id = ${id}, user = ${ JSON.stringify(user) }`);
    return this._lessonRepository.findOne({ where: { id: id, user: user } });
  }

  async remove(id: string, user: User): Promise<void> {
    this._logger.log(`remove: id = ${id}, user = ${ JSON.stringify(user) }`);
    const lesson: Lesson = await this.findOne(id, user);
    if (lesson) await this._lessonRepository.delete(id);
  }

  async create(createLessonDto: CreateLessonDto, user: User): Promise<Lesson> {
    this._logger.log(`create: createLessonDto = ${ JSON.stringify(createLessonDto)}, user = ${ JSON.stringify(user) }`);
    const lesson: Partial<Lesson> = createLessonDto;
    lesson.user = user
    return await this._lessonRepository.save(lesson);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, user: User): Promise<void> {
    this._logger.log(`update: updateLessonDto = ${ JSON.stringify(updateLessonDto)}, user = ${ JSON.stringify(user) }`);
    if (await this.findOne(id, user)) {
      const lesson: Partial<Lesson> = updateLessonDto;
      await this._lessonRepository.update(id, lesson);
    }
  }
}
