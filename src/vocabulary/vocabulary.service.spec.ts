import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationService } from '../configuration/configuration.service';
import { Lesson } from '../lessons/lesson.entity';
import { LessonRepositoryMock } from '../lessons/lesson.repository.mock';
import { LessonsService } from '../lessons/lessons.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Vocabulary } from './vocabulary.entity';
import { VocabularyRepositoryMock } from './vocabulary.repository.mock';
import { VocabularyService } from './vocabulary.service';
import { addVocabulary, initialVocabularyRepository, knownVocabulary, unknownVocabulary, updateVocabulary, updateVocabulary_LevelTooHighTest, updateVocabulary_LevelTooLowTest, vocabularyUser_1, vocabularyUser_2 } from './vocabulary.test.data';

describe('VocabulariesService', () => {
  let service: VocabularyService;
  let configuration : ConfigurationService;

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
        ConfigurationService,
      ],
    }).compile();

    service = module.get<VocabularyService>(VocabularyService);
    configuration = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  describe('findAll', () => {
    it('should return an array of vocabularies', async () => {
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        vocab => {
          if (vocab.user.id === vocabularyUser_1.id) {
            return true;
          } else {
            return false;
          }
        },
      );
      
      const result = await service.findAll(vocabularyUser_1);

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('findOne', () => {
    it('should return the one vocabulary we are requesting', async () => {
      const expected_result: Vocabulary = initialVocabularyRepository.find(
        vocab => vocab.id === 2,
      );
      expect(await service.findOne('2', vocabularyUser_1)).toEqual(expected_result);
    });

    it('should not find a valid ID but from different user', async () => {
      expect(await service.findOne('1', vocabularyUser_2)).toBeUndefined();
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await service.findOne('0', vocabularyUser_1)).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove the vocabulary', async () => {
      // we will be deleting the entry with the ID 2
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        vocab => {
          if ((vocab.id === 2) || (vocab.user.id !== vocabularyUser_1.id)) {
            return false;
          } else {
            return true;
          }
        },
      );

      const entries_before = await (await service.findAll(vocabularyUser_1)).length;
      await service.remove('2', vocabularyUser_1);

      const after_remove: Array<Vocabulary> = await service.findAll(vocabularyUser_1);
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await service.findOne('2', vocabularyUser_1)).toBeUndefined();
    });

    it('should not remove a valid ID but from different user', async () => {
      expect(await service.findOne('6', vocabularyUser_1)).toBeDefined();

      await service.remove('6', vocabularyUser_2);

      expect(await service.findOne('6', vocabularyUser_1)).toBeDefined();
    });

    it('should leave the vocabulary unchanged if the id does not exist', async () => {
      const expected_result: ReadonlyArray<Vocabulary> = initialVocabularyRepository.filter(
        lesson => {
          if (lesson.user.id !== vocabularyUser_1.id) {
            return false;
          } else {
            return true;
          }
        },
      );
      await service.remove('0', vocabularyUser_1);
      expect(await service.findAll(vocabularyUser_1)).toEqual(expected_result);
    });
  });

  describe('create', () => {
    it('should add the vocabulary to the repository', async () => {
      const vocab: CreateVocabularyDto = {
        language_a: addVocabulary.language_a,
        language_b: addVocabulary.language_b,
        lesson: addVocabulary.lesson.id,
      };

      const vocabulary: Vocabulary = await service.create(vocab, vocabularyUser_1);
      expect(vocabulary.language_a).toEqual(addVocabulary.language_a);
      expect(vocabulary.language_b).toEqual(addVocabulary.language_b);
      expect(vocabulary.dueDate).toEqual(addVocabulary.dueDate);
      expect(vocabulary.level).toEqual(addVocabulary.level);

      const allVocabularies = await service.findAll(vocabularyUser_1);
      //Todo: Improve search
      const searchResult: Vocabulary = allVocabularies.find(
        vocab => vocab.language_a === addVocabulary.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    const updateCheck = async (update: Vocabulary) => {
      const allVocabularies = await service.findAll(vocabularyUser_1);
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

      await service.update(updateVocabulary.id.toString(), vocab, vocabularyUser_1);
      updateCheck(updateVocabulary);
    });

    it('should not update a valid ID but from different user', async () => {
      const vocabulary_before: Vocabulary = await service.findOne(updateVocabulary.id.toString(), vocabularyUser_1);

      const vocabulary_in: UpdateVocabularyDto = {
        language_a: updateVocabulary.language_a,
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level
      };

      await service.update(updateVocabulary.id.toString(), vocabulary_in, vocabularyUser_2);

      const vocabulary_after: Vocabulary = await service.findOne(updateVocabulary.id.toString(), vocabularyUser_1);

      expect(vocabulary_before).toEqual(vocabulary_after);
    });

    it('should update the vocabulary with partial information - language_a empty', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: '',
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level,
      };

      await service.update(updateVocabulary.id.toString(), vocab, vocabularyUser_1);
      updateCheck(updateVocabulary);
    });

    it('should update the vocabulary with partial information - language_a & b empty', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: '',
        language_b: '',
        level: updateVocabulary.level,
      };

      await service.update(updateVocabulary.id.toString(), vocab, vocabularyUser_1);
      updateCheck(updateVocabulary);
    });

    it('should gracefully handle attempts to set the level above', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: updateVocabulary_LevelTooHighTest.language_a,
        language_b: updateVocabulary_LevelTooHighTest.language_b,
        level: updateVocabulary_LevelTooHighTest.level + 1,
      };

      await service.update(updateVocabulary.id.toString(), vocab, vocabularyUser_1);
      updateCheck(updateVocabulary_LevelTooHighTest);
    });

    it('should gracefully handle attempts to set the level above', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: updateVocabulary_LevelTooLowTest.language_a,
        language_b: updateVocabulary_LevelTooLowTest.language_b,
        level: updateVocabulary_LevelTooLowTest.level - 1,
      };

      await service.update(updateVocabulary.id.toString(), vocab, vocabularyUser_1);
      updateCheck(updateVocabulary_LevelTooLowTest);
    });
  });

  describe('vocabKnown', () => {
    it('should update the vocabulary', async () => {
      const expected_result = knownVocabulary;
      expected_result.level += 1;
      
      const nextDueIn: number = configuration.getDueInDays(expected_result.level);

      expected_result.dueDate = new Date();
      expected_result.dueDate.setHours(0,0,0,0);
      expected_result.dueDate.setDate(expected_result.dueDate.getDate() + nextDueIn);

      await service.vocabKnown(knownVocabulary.id.toString(), vocabularyUser_1);
      const result = await service.findOne(knownVocabulary.id.toString(), vocabularyUser_1);

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });

    it('should not update valid vocabulary from different user', async() => {
      const expected_result = knownVocabulary;
      await service.vocabKnown(knownVocabulary.id.toString(), vocabularyUser_2);
      expect(await service.findOne(knownVocabulary.id.toString(), vocabularyUser_1)).toEqual(expected_result);
    })

    it('should not go above level 7', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooHighTest);
      expected_result.dueDate = new Date(9999,12,31);
      await service.vocabKnown(updateVocabulary_LevelTooHighTest.id.toString(), vocabularyUser_1);
      const result = await service.findOne(
        updateVocabulary_LevelTooHighTest.id.toString(),
        vocabularyUser_1
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
      expected_result.dueDate = new Date();
      expected_result.dueDate.setHours(0,0,0,0);
      expected_result.dueDate.setDate(expected_result.dueDate.getDate() + 1);

      await service.vocabUnknown(unknownVocabulary.id.toString(), vocabularyUser_1);
      const result = await service.findOne(unknownVocabulary.id.toString(), vocabularyUser_1);

      expect(result).toEqual(expected_result);
    });

    it('should not update valid vocabulary from different user', async() => {
      const expected_result = knownVocabulary;
      await service.vocabUnknown(knownVocabulary.id.toString(), vocabularyUser_2);
      expect(await service.findOne(knownVocabulary.id.toString(), vocabularyUser_1)).toEqual(expected_result);
    })

    it('should not go below level 1', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooLowTest);
      await service.vocabUnknown(
        updateVocabulary_LevelTooLowTest.id.toString(),
        vocabularyUser_1
      );
      const result = await service.findOne(
        updateVocabulary_LevelTooLowTest.id.toString(),
        vocabularyUser_1
      );

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });
  });

  describe('getLessonVocabulary', () => {
    it('should return all the Lesson Vocabulary', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        (vocabulary: Vocabulary) => {
          if (vocabulary.lesson.id === testLessonID) return vocabulary;
        }
      );
      const result = await service.getLessonVocabulary(testLessonID.toString(), vocabularyUser_1);

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });

    it('should only return vocabulary for the lesson', async() => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const result = await service.getLessonVocabulary(testLessonID.toString(), vocabularyUser_1);
      const expected_result: Array<Vocabulary> = result.filter(
        (vocabulary: Vocabulary) => {
          if (vocabulary.lesson.id === testLessonID) return vocabulary;
        }
      );

      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('getDueLessonVocabulary', () => {
    it('should return the same number of vocabularies as there are due vocabularies', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const currentDate = new Date();
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        (vocabulary: Vocabulary) => {
          if (vocabulary.dueDate <= currentDate) return vocabulary;
        }
      );
      const result = await service.getDueLessonVocabulary(testLessonID.toString(), vocabularyUser_1);

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    })

    it('should only return due vocabularies', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const currentDate = new Date();
      const result = await service.getDueLessonVocabulary(testLessonID.toString(), vocabularyUser_1);
      const expected_result: Array<Vocabulary> = result.filter(
        (vocabulary: Vocabulary) => {
          if ((vocabulary.dueDate <= currentDate) && (vocabulary.lesson.id === testLessonID)) return vocabulary;
        }
      );
      
      expect(result.length).toBe(expected_result.length);
    });
  });
});
