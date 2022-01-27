import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfigurationService } from '../app-configuration/app-configuration.service';
import { LessonsService } from '../lessons/lessons.service';
import { User } from '../users/user.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Vocabulary } from './vocabulary.entity';

@Injectable()
export class VocabularyService {
  private readonly _logger = new Logger(VocabularyService.name);
  
  constructor(
    @InjectRepository(Vocabulary)
    private _vocabulariesRepository: Repository<Vocabulary>,
    private _lessonsService: LessonsService,
    private _configurationService: AppConfigurationService
  ) { }

  async findAll(user: User): Promise<Vocabulary[]> {
    this._logger.log(`findAll: user = ${ JSON.stringify(user) }`);
    return this._vocabulariesRepository.find({ where: { user: user } });
  }

  findOne(id: string, user: User): Promise<Vocabulary> {
    this._logger.log(`findOne: id = ${id}, user = ${ JSON.stringify(user) }`);
    return this._vocabulariesRepository.findOne({ where: { id: id, user: user } });
  }

  async remove(id: string, user: User): Promise<void> {
    this._logger.log(`remove: id = ${id}, user = ${ JSON.stringify(user) }`);
    const vocabulary: Vocabulary = await this.findOne(id, user);
    if (vocabulary) await this._vocabulariesRepository.delete(id);
  }

  async create(createVocabularyDto: CreateVocabularyDto, user: User): Promise<Vocabulary> {
    this._logger.log(`create: createVocabularyDto = ${ JSON.stringify(createVocabularyDto)}, user = ${ JSON.stringify(user) }`);
    const vocabulary: Vocabulary = new Vocabulary();

    vocabulary.user = user;
    vocabulary.language_a = createVocabularyDto.language_a;
    vocabulary.language_b = createVocabularyDto.language_b;
    vocabulary.level = 1;
    vocabulary.dueDate = new Date();
    vocabulary.dueDate.setHours(0, 0, 0, 0);
    vocabulary.lesson = await this._lessonsService.findOne(
      createVocabularyDto.lesson.toString(),
      user
    );
    return await this._vocabulariesRepository.save(vocabulary);
  }

  async update(id: string, updateVocabularyDto: UpdateVocabularyDto, user: User): Promise<void> {
    this._logger.log(`update: updateVocabularyDto = ${ JSON.stringify(updateVocabularyDto)}, user = ${ JSON.stringify(user) }`);
    const vocabulary: Vocabulary = await this.findOne(id, user);

    if (vocabulary) {
      vocabulary.language_a = updateVocabularyDto.language_a;
      vocabulary.language_b = updateVocabularyDto.language_b;
      if (updateVocabularyDto.level > 0 && updateVocabularyDto.level < 8) {
        vocabulary.level = updateVocabularyDto.level;
        //ToDo update date?
      } else {
        vocabulary.level = vocabulary.level;
      }
      await this._vocabulariesRepository.update(id, vocabulary);
    }
  }

  async vocabKnown(id: string, user: User): Promise<void> {
    this._logger.log(`vocabKnown: id = ${id}, user = ${ JSON.stringify(user) }`);
    const vocabulary = await this.findOne(id, user);

    if (vocabulary) {
      vocabulary.level += 1;

      const nextDueIn: number = this._configurationService.getDueInDays(vocabulary.level);

      if (vocabulary.level < 7) {
        vocabulary.dueDate = new Date();
        vocabulary.dueDate.setHours(0, 0, 0, 0);
        vocabulary.dueDate.setDate(vocabulary.dueDate.getDate() + nextDueIn);
      } else {
        vocabulary.level = 7;
        vocabulary.dueDate = new Date(9999, 12, 31);
      }
      await this._vocabulariesRepository.update(id, vocabulary);
    }
  }

  async vocabUnknown(id: string, user: User): Promise<void> {
    this._logger.log(`vocabUnknown: id = ${id}, user = ${ JSON.stringify(user) }`);
    const vocabulary = await this.findOne(id, user);

    if (vocabulary) {
      if (vocabulary.level > 1) {
        vocabulary.level -= 1;
        vocabulary.dueDate = new Date();
        vocabulary.dueDate.setHours(0, 0, 0, 0);
        vocabulary.dueDate.setDate(vocabulary.dueDate.getDate() + 1);
      }
      await this._vocabulariesRepository.update(id, vocabulary);
    }
  }

  async getLessonVocabulary(id: string, user: User): Promise<Vocabulary[]> {
    this._logger.log(`getLessonVocabulary: id = ${id}, user = ${ JSON.stringify(user) }`);
    return this._vocabulariesRepository.find({ where: { lesson: id, user: user } });
  }

  async getDueLessonVocabulary(id: string, user: User): Promise<Vocabulary[]> {
    this._logger.log(`getDueLessonVocabulary: id = ${id}, user = ${ JSON.stringify(user) }`);
    const currentDate = new Date();
    const lessonVocabulary: ReadonlyArray<Vocabulary> = await this.getLessonVocabulary(id, user);
    return lessonVocabulary.filter(vocab => {
      return vocab.dueDate < currentDate;
    });
  }
}
