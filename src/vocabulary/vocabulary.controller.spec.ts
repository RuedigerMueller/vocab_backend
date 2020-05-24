import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from './vocabulary.entity';
import { VocabularyRepositoryMock } from './vocabulary.repository.mock';
import {
  initialVocabularyRepository,
  addVocabulary,
  updateVocabulary,
  knownVocabulary,
  unknownVocabulary,
  updateVocabulary_LevelTooHighTest,
  updateVocabulary_LevelTooLowTest,
} from './vocabulary.test.data';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Lesson } from '../lessons/lesson.entity';
import { LessonRepositoryMock } from '../lessons/lesson.repository.mock';
import { LessonsService } from '../lessons/lessons.service';

describe('Vocabularies Controller', () => {
  let controller: VocabularyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabularyController],
      providers: [
        VocabularyService,
        {
          provide: getRepositoryToken(Vocabulary),
          useClass: VocabularyRepositoryMock,
        },
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useClass: LessonRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<VocabularyController>(VocabularyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should find vocabularies', async () => {
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.map(
        obj => ({ ...obj }),
      );
      const result = await controller.findAll();

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('findOne', () => {
    it('should return the one vocabulary we are requesting', async () => {
      const expected_result: Vocabulary = initialVocabularyRepository.find(
        vocab => vocab.id === 2,
      );
      expect(await controller.findOne('2')).toEqual(expected_result);
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await controller.findOne('0')).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove the vocabulary', async () => {
      // we will be deleting the entry with the ID 2
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        vocab => {
          if (vocab.id === 2) {
            return false;
          } else {
            return true;
          }
        },
      );

      const entries_before = await (await controller.findAll()).length;
      await controller.remove('2');

      const after_remove: Array<Vocabulary> = await controller.findAll();
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await controller.findOne('2')).toBeUndefined();
    });

    it('should leave the vocabulary unchanged if the id does not exist', async () => {
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.map(
        obj => ({ ...obj }),
      );
      await controller.remove('0');
      expect(await controller.findAll()).toEqual(expected_result);
    });
  });

  describe('create', () => {
    it('should add the vocabulary to the repository', async () => {
      const vocab: CreateVocabularyDto = {
        language_a: addVocabulary.language_a,
        language_b: addVocabulary.language_a,
        lesson: addVocabulary.lesson.id,
      };

      await controller.create(vocab);

      const allVocabularies = await controller.findAll();
      const searchResult: Vocabulary = allVocabularies.find(
        vocab => vocab.language_a === addVocabulary.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the vocabulary', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: updateVocabulary.language_a,
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level,
      };

      await controller.update(updateVocabulary.id.toString(), vocab);
      const allVocabularies = await controller.findAll();
      const searchResult: Vocabulary = allVocabularies.find(
        vocab => vocab.id === updateVocabulary.id,
      );
      expect(searchResult).toBeDefined();
      expect(searchResult.id).toBe(updateVocabulary.id);
      expect(searchResult.language_a).toBe(updateVocabulary.language_a);
      expect(searchResult.language_b).toBe(updateVocabulary.language_b);
      expect(searchResult.level).toBe(updateVocabulary.level);
      expect(searchResult.dueDate).toStrictEqual(updateVocabulary.dueDate);
    });
  });

  describe('vocabKnown', () => {
    it('should update the vocabulary', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, knownVocabulary);
      expected_result.level = expected_result.level + 1;
      expected_result.dueDate.setDate(expected_result.dueDate.getDate() + 1);

      await controller.vocabKnown(knownVocabulary.id.toString());
      const result = await controller.findOne(knownVocabulary.id.toString());

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });

    it('should not go above level 7', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooHighTest);
      await controller.vocabKnown(updateVocabulary_LevelTooHighTest.id.toString());
      const result = await controller.findOne(
        updateVocabulary_LevelTooHighTest.id.toString(),
      );

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });
  });

  describe('vocabUnknown', () => {
    it('should update the vocabulary', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, unknownVocabulary);
      expected_result.level = expected_result.level - 1;
      expected_result.dueDate.setDate(expected_result.dueDate.getDate() - 1);

      await controller.vocabUnknown(unknownVocabulary.id.toString());
      const result = await controller.findOne(unknownVocabulary.id.toString());

      expect(result).toEqual(expected_result);
    });

    it('should not go below level 1', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooLowTest);
      await controller.vocabUnknown(
        updateVocabulary_LevelTooLowTest.id.toString(),
      );
      const result = await controller.findOne(
        updateVocabulary_LevelTooLowTest.id.toString(),
      );

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });
  });

  describe('getLessonVocabulary', () => {
    it('should return all the Lesson Vocabulary', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.map(
        (vocabulary: Vocabulary) => {
          if (vocabulary.lesson.id === testLessonID) return vocabulary;
        }
      );
      const result = await controller.getLessonVocabulary(testLessonID.toString());

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
    
    it('should only return vocabulary for the lesson', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const result = await controller.getLessonVocabulary(testLessonID.toString());
      const expected_result: Array<Vocabulary> = result.map(
        (vocabulary: Vocabulary) => {
          if (vocabulary.lesson.id === testLessonID) return vocabulary;
        }
      );

      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('getDueLessonVocabulary', () => {
    xit('should return the same number of vocabularies as there are due vocabularies', async() => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const currentDate = new Date();
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.map(
        (vocabulary: Vocabulary) => {
          if (vocabulary.dueDate <= currentDate) return vocabulary;
        }
      );
      const result = await controller.getDueLessonVocabulary(testLessonID.toString());

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });

    it('should only return due vocabularies', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const currentDate = new Date();
      const result = await controller.getDueLessonVocabulary(testLessonID.toString());
      const expected_result: Array<Vocabulary> = result.map(
        (vocabulary: Vocabulary) => {
          if ((vocabulary.dueDate <= currentDate) && (vocabulary.lesson.id === testLessonID)) return vocabulary;
        }
      );
 
      expect(result.length).toBe(expected_result.length);
    });
  });
});
