import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from './vocabulary.entity';
import { VocabularyRepositoryMock } from './vocabulary.repository.mock';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import {
  initialVocabularyRepository,
  addVocabulary,
  updateVocabulary,
  knownVocabulary,
  unknownVocabulary,
  updateVocabulary_LevelTooHighTest,
  updateVocabulary_LevelTooLowTest,
} from './vocabulary.test.data';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/lesson.entity';
import { LessonRepositoryMock } from '../lessons/lesson.repository.mock';

describe('VocabulariesService', () => {
  let service: VocabularyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<VocabularyService>(VocabularyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of vocabularies', async () => {
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.map(
        obj => ({ ...obj }),
      );
      const result = await service.findAll();

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('findOne', () => {
    it('should return the one vocabulary we are requesting', async () => {
      const expected_result: Vocabulary = initialVocabularyRepository.find(
        vocab => vocab.id === 2,
      );
      expect(await service.findOne('2')).toEqual(expected_result);
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await service.findOne('0')).toBeUndefined();
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

      const entries_before = await (await service.findAll()).length;
      await service.remove('2');

      const after_remove: Array<Vocabulary> = await service.findAll();
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await service.findOne('2')).toBeUndefined();
    });

    it('should leave the vocabulary unchanged if the id does not exist', async () => {
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.map(
        obj => ({ ...obj }),
      );
      await service.remove('0');
      expect(await service.findAll()).toEqual(expected_result);
    });
  });

  describe('create', () => {
    it('should add the vocabulary to the repository', async () => {
      const vocab: CreateVocabularyDto = {
        language_a: addVocabulary.language_a,
        language_b: addVocabulary.language_b,
        lesson: addVocabulary.lesson.id,
      };

      const vocabulary: Vocabulary = await service.create(vocab);
      expect(vocabulary.language_a).toEqual(addVocabulary.language_a);
      expect(vocabulary.language_b).toEqual(addVocabulary.language_b);
      expect(vocabulary.dueDate).toEqual(addVocabulary.dueDate);
      expect(vocabulary.level).toEqual(addVocabulary.level);

      const allVocabularies = await service.findAll();
      //Todo: Improve search
      const searchResult: Vocabulary = allVocabularies.find(
        vocab => vocab.language_a === addVocabulary.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    const updateCheck = async (update: Vocabulary) => {
      const allVocabularies = await service.findAll();
      const searchResult: Vocabulary = allVocabularies.find(
        vocab => vocab.id === update.id,
      );
      expect(searchResult).toBeDefined();
      expect(searchResult.id).toBe(update.id);
      expect(searchResult.language_a).toBe(update.language_a);
      expect(searchResult.language_b).toBe(update.language_b);
      expect(searchResult.level).toBe(update.level);
      expect(searchResult.dueDate).toStrictEqual(update.dueDate);
    };

    it('should update the vocabulary', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: updateVocabulary.language_a,
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level,
      };

      await service.update(updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary);
    });

    it('should update the vocabulary with partial information - language_a empty', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: '',
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level,
      };

      await service.update(updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary);
    });

    it('should update the vocabulary with partial information - language_a & b empty', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: '',
        language_b: '',
        level: updateVocabulary.level,
      };

      await service.update(updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary);
    });

    it('should gracefully handle attempts to set the level above', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: updateVocabulary_LevelTooHighTest.language_a,
        language_b: updateVocabulary_LevelTooHighTest.language_b,
        level: updateVocabulary_LevelTooHighTest.level + 1,
      };

      await service.update(updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary_LevelTooHighTest);
    });

    it('should gracefully handle attempts to set the level above', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: updateVocabulary_LevelTooLowTest.language_a,
        language_b: updateVocabulary_LevelTooLowTest.language_b,
        level: updateVocabulary_LevelTooLowTest.level - 1,
      };

      await service.update(updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary_LevelTooLowTest);
    });
  });

  describe('vocabKnown', () => {
    it('should update the vocabulary', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, knownVocabulary);
      expected_result.level = expected_result.level + 1;
      expected_result.dueDate.setDate(expected_result.dueDate.getDate() + 1);

      await service.vocabKnown(knownVocabulary.id.toString());
      const result = await service.findOne(knownVocabulary.id.toString());

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });

    it('should not go above level 7', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooHighTest);
      await service.vocabKnown(updateVocabulary_LevelTooHighTest.id.toString());
      const result = await service.findOne(
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

      await service.vocabUnknown(unknownVocabulary.id.toString());
      const result = await service.findOne(unknownVocabulary.id.toString());

      expect(result).toEqual(expected_result);
    });

    it('should not go below level 1', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooLowTest);
      await service.vocabUnknown(
        updateVocabulary_LevelTooLowTest.id.toString(),
      );
      const result = await service.findOne(
        updateVocabulary_LevelTooLowTest.id.toString(),
      );

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });
  });
});
