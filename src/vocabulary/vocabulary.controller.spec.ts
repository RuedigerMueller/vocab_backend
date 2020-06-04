import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationService } from '../app-configuration/app-configuration.service';
import { Lesson } from '../lessons/lesson.entity';
import { LessonRepositoryMock } from '../lessons/lesson.repository.mock';
import { LessonsService } from '../lessons/lessons.service';
import { lessonUser_2 } from '../lessons/lessons.test.data';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyController } from './vocabulary.controller';
import { Vocabulary } from './vocabulary.entity';
import { VocabularyRepositoryMock } from './vocabulary.repository.mock';
import { VocabularyService } from './vocabulary.service';
import { addVocabulary, initialVocabularyRepository, knownVocabulary, unknownVocabulary, updateVocabulary, updateVocabulary_LevelTooHighTest, updateVocabulary_LevelTooLowTest, vocabularyUser_1 } from './vocabulary.test.data';

describe('Vocabularies Controller', () => {
  let controller: VocabularyController;
  let configuration: ConfigurationService;
  const http = require('http');
  const request = new http.IncomingMessage();
  request.user = vocabularyUser_1;

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
        ConfigurationService,
      ],
    }).compile();

    controller = module.get<VocabularyController>(VocabularyController);
    configuration = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should find vocabularies', async () => {
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        vocab => {
          if (vocab.user.id === vocabularyUser_1.id) {
            return true;
          } else {
            return false;
          }
        },
      );
      const result = await controller.findAll(request);

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('findOne', () => {
    it('should return the one vocabulary we are requesting', async () => {
      const expected_result: Vocabulary = initialVocabularyRepository.find(
        vocab => vocab.id === 2,
      );
      expect(await controller.findOne(request, '2')).toEqual(expected_result);
    });

    it('should not find a valid ID but from different user', async () => {
      expect(await controller.findOne(request, '7')).toBeUndefined();
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await controller.findOne(request, '0')).toBeUndefined();
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

      const entries_before = await (await controller.findAll(request)).length;
      await controller.remove(request, '2');

      const after_remove: Array<Vocabulary> = await controller.findAll(request);
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await controller.findOne(request, '2')).toBeUndefined();
    });

    it('should not remove a valid ID but from different user', async () => {
      let request_user_2 = new http.IncomingMessage();
      request_user_2.user = lessonUser_2;
      expect(await controller.findOne(request, '6')).toBeDefined();

      await controller.remove(request_user_2, '6',);

      expect(await controller.findOne(request, '6')).toBeDefined();
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
      
      await controller.remove(request, '0');
      expect(await controller.findAll(request)).toEqual(expected_result);
    });
  });

  describe('create', () => {
    it('should add the vocabulary to the repository', async () => {
      const vocab: CreateVocabularyDto = {
        language_a: addVocabulary.language_a,
        language_b: addVocabulary.language_a,
        lesson: addVocabulary.lesson.id,
      };

      await controller.create(request, vocab);

      const allVocabularies = await controller.findAll(request);
      const searchResult: Vocabulary = allVocabularies.find(
        vocab => vocab.language_a === addVocabulary.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    const updateCheck = async (update: Vocabulary) => {
      const allVocabularies = await controller.findAll(request);
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

      await controller.update(request, updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary);
    });

    it('should not update a valid ID but from different user', async () => {
      const vocabulary_before: Vocabulary = await controller.findOne(request, updateVocabulary.id.toString());

      const vocabulary_in: UpdateVocabularyDto = {
        language_a: updateVocabulary.language_a,
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level
      };

      const request_user_2 = new http.IncomingMessage();
      request_user_2.user = lessonUser_2;
      
      await controller.update(request_user_2, updateVocabulary.id.toString(), vocabulary_in,);

      const vocabulary_after: Vocabulary = await controller.findOne(request, updateVocabulary.id.toString());

      expect(vocabulary_before).toEqual(vocabulary_after);
    });

    it('should update the vocabulary with partial information - language_a empty', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: '',
        language_b: updateVocabulary.language_b,
        level: updateVocabulary.level,
      };

      await controller.update(request, updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary);
    });

    it('should update the vocabulary with partial information - language_a & b empty', async () => {
      const vocab: UpdateVocabularyDto = {
        language_a: '',
        language_b: '',
        level: updateVocabulary.level,
      };

      await controller.update(request, updateVocabulary.id.toString(), vocab);
      updateCheck(updateVocabulary);
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

      await controller.vocabKnown(request, knownVocabulary.id.toString());
      const result = await controller.findOne(request, knownVocabulary.id.toString());

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });

    it('should not update valid vocabulary from different user', async() => {
      const expected_result = knownVocabulary;

      const request_user_2 = new http.IncomingMessage();
      request_user_2.user = lessonUser_2;

      await controller.vocabKnown(request_user_2, knownVocabulary.id.toString());
      expect(await controller.findOne(request, knownVocabulary.id.toString())).toEqual(expected_result);
    })
    
    it('should not go above level 7', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooHighTest);
      expected_result.dueDate = new Date(9999,12,31);
      await controller.vocabKnown(request, updateVocabulary_LevelTooHighTest.id.toString());
      const result = await controller.findOne(
        request, 
        updateVocabulary_LevelTooHighTest.id.toString(),
      );

      expect(result).toMatchObject(expected_result);
      expect(result.dueDate).toEqual(expected_result.dueDate);
    });
  });

  describe('vocabUnknown', () => {
    it('should update the vocabulary', async () => {
      const  expected_result = unknownVocabulary;
      expected_result.level = expected_result.level - 1;
      expected_result.dueDate = new Date();
      expected_result.dueDate.setHours(0,0,0,0);
      expected_result.dueDate.setDate(expected_result.dueDate.getDate() + 1);

      await controller.vocabUnknown(request, unknownVocabulary.id.toString());
      const result = await controller.findOne(request, unknownVocabulary.id.toString());

      expect(result).toEqual(expected_result);
    });

    it('should not update valid vocabulary from different user', async() => {
      const expected_result = unknownVocabulary;

      const request_user_2 = new http.IncomingMessage();
      request_user_2.user = lessonUser_2;

      await controller.vocabUnknown(request_user_2, unknownVocabulary.id.toString());
      expect(await controller.findOne(request, unknownVocabulary.id.toString())).toEqual(expected_result);
    })

    it('should not go below level 1', async () => {
      let expected_result: Vocabulary = new Vocabulary();
      expected_result = Object.assign({}, updateVocabulary_LevelTooLowTest);
      await controller.vocabUnknown(
        request, 
        updateVocabulary_LevelTooLowTest.id.toString(),
      );
      const result = await controller.findOne(
        request, 
        updateVocabulary_LevelTooLowTest.id.toString(),
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
      const result = await controller.getLessonVocabulary(request, testLessonID.toString());

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
    
    it('should only return vocabulary for the lesson', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const result = await controller.getLessonVocabulary(request, testLessonID.toString());
      const expected_result: Array<Vocabulary> = result.filter(
        (vocabulary: Vocabulary) => {
          if (vocabulary.lesson.id === testLessonID) return vocabulary;
        }
      );

      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('getDueLessonVocabulary', () => {
    it('should return the same number of vocabularies as there are due vocabularies', async() => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const currentDate = new Date();
      const expected_result: Array<Vocabulary> = initialVocabularyRepository.filter(
        (vocabulary: Vocabulary) => {
          if (vocabulary.dueDate <= currentDate) return vocabulary;
        }
      );
      const result = await controller.getDueLessonVocabulary(request, testLessonID.toString());

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });

    it('should only return due vocabularies', async () => {
      const testLessonID: number = initialVocabularyRepository[0].lesson.id;
      const currentDate = new Date();
      const result = await controller.getDueLessonVocabulary(request, testLessonID.toString());
      const expected_result: Array<Vocabulary> = result.filter(
        (vocabulary: Vocabulary) => {
          if ((vocabulary.dueDate <= currentDate) && (vocabulary.lesson.id === testLessonID)) return vocabulary;
        }
      );
 
      expect(result.length).toBe(expected_result.length);
    });
  });
});
