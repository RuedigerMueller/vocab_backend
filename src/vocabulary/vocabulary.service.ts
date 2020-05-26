import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Vocabulary } from './vocabulary.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private _vocabulariesRepository: Repository<Vocabulary>,
    private _lessonsService: LessonsService,
  ) { }

  async findAll(): Promise<Vocabulary[]> {
    return this._vocabulariesRepository.find();
  }

  findOne(id: string): Promise<Vocabulary> {
    return this._vocabulariesRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this._vocabulariesRepository.delete(id);
  }

  async create(createVocabularyDto: CreateVocabularyDto): Promise<Vocabulary> {
    const vocabulary = new Vocabulary();

    vocabulary.language_a = createVocabularyDto.language_a;
    vocabulary.language_b = createVocabularyDto.language_b;
    vocabulary.level = 1;
    vocabulary.dueDate = new Date();
    // vocabulary.dueDate = new Date(2021,12,30);
    vocabulary.dueDate.setHours(0, 0, 0, 0);
    vocabulary.lesson = await this._lessonsService.findOne(
      createVocabularyDto.lesson.toString(),
    );
    return await this._vocabulariesRepository.save(vocabulary);
  }

  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
  ): Promise<void> {
    const vocabulary = new Vocabulary();
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

  async vocabKnown(id: string): Promise<void> {
    const vocabulary = await this.findOne(id);

    vocabulary.level += 1;

    let nextDueIn: number;
    switch (vocabulary.level) {
      case 2:
        nextDueIn = 1;
      case 3:
        nextDueIn = 2;
      case 4:
        nextDueIn = 5;
      case 5:
        nextDueIn = 10;
      case 6:
        nextDueIn = 30;
      case 7:
        nextDueIn = 80;
      default:
        nextDueIn = 1;
    }
    if (vocabulary.level !== 8) {
      vocabulary.dueDate = new Date();
      vocabulary.dueDate.setHours(0, 0, 0, 0);
      vocabulary.dueDate.setDate(vocabulary.dueDate.getDate() + nextDueIn);
    } else {
      vocabulary.level = 7;
      vocabulary.dueDate = new Date(9999, 12, 31);
    }

    await this._vocabulariesRepository.update(id, vocabulary);
  }

  async vocabUnknown(id: string): Promise<void> {
    const vocabulary = await this.findOne(id);
    if (vocabulary.level > 1) {
      vocabulary.level -= 1;
      vocabulary.dueDate = new Date();
      vocabulary.dueDate.setHours(0, 0, 0, 0);
      vocabulary.dueDate.setDate(vocabulary.dueDate.getDate() + 1);
    }

    await this._vocabulariesRepository.update(id, vocabulary);
  }

  async getLessonVocabulary(id: string): Promise<Vocabulary[]> {
    return this._vocabulariesRepository.find({ where: { lesson: id } });
  }

  async getDueLessonVocabulary(id: string): Promise<Vocabulary[]> {
    // return this._vocabulariesRepository.find({ where: { lesson: id, dueDate: LessThanOrEqual(Date()) } });
    const currentDate = new Date();
    const lessonVocabulary: ReadonlyArray<Vocabulary> = await this.getLessonVocabulary(id);
    return lessonVocabulary.filter(vocab => {
      return vocab.dueDate < currentDate;
    });
  }
}
