import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonsService } from '../lessons/lessons.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Vocabulary } from './vocabulary.entity';
import { ConfigurationService } from '../configuration/configuration.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private _vocabulariesRepository: Repository<Vocabulary>,
    private _lessonsService: LessonsService,
    private _configurationService: ConfigurationService
  ) { }

  async findAll(user: User): Promise<Vocabulary[]> {
    return this._vocabulariesRepository.find({ where: { username: user.username } });
  }

  findOne(id: string, user: User): Promise<Vocabulary> {
    return this._vocabulariesRepository.findOne({ where: { id: id, username: user.username } });
  }

  async remove(id: string, user: User): Promise<void> {
    const vocabulary: Vocabulary = await this.findOne(id, user);
    if (vocabulary) await this._vocabulariesRepository.delete(id);
  }

  async create(createVocabularyDto: CreateVocabularyDto, user: User): Promise<Vocabulary> {
    const vocabulary: Vocabulary = new Vocabulary();

    vocabulary.user = user;
    vocabulary.language_a = createVocabularyDto.language_a;
    vocabulary.language_b = createVocabularyDto.language_b;
    vocabulary.level = 1;
    vocabulary.dueDate = new Date();
    // vocabulary.dueDate = new Date(2021,12,30);
    vocabulary.dueDate.setHours(0, 0, 0, 0);
    vocabulary.lesson = await this._lessonsService.findOne(
      createVocabularyDto.lesson.toString(),
      user
    );
    return await this._vocabulariesRepository.save(vocabulary);
  }

  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    user: User
  ): Promise<void> {
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
    return this._vocabulariesRepository.find({ where: { lesson: id, username: user } });
  }

  async getDueLessonVocabulary(id: string, user: User): Promise<Vocabulary[]> {
    // return this._vocabulariesRepository.find({ where: { lesson: id, dueDate: LessThanOrEqual(Date()) } });
    const currentDate = new Date();
    const lessonVocabulary: ReadonlyArray<Vocabulary> = await this.getLessonVocabulary(id, user);
    return lessonVocabulary.filter(vocab => {
      return vocab.dueDate < currentDate;
    });
  }
}
