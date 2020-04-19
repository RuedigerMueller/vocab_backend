import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { LessonRepositoryMock } from './lesson.repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  initialLessonRepository,
  addLesson,
  updateLesson,
} from './lessons.test.data';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

describe('LessonsService', () => {
  let service: LessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useClass: LessonRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of lessons', async () => {
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository;
      const result = await service.findAll();

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('findOne', () => {
    it('should return the one lesson we are requesting', async () => {
      const expected_result: Lesson = initialLessonRepository.find(
        lesson => lesson.id === 2,
      );
      expect(await service.findOne('2')).toEqual(expected_result);
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await service.findOne('0')).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove the lesson', async () => {
      // we will be deleting the entry with the ID 2
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository.filter(
        lesson => {
          if (lesson.id === 2) {
            return false;
          } else {
            return true;
          }
        },
      );

      const entries_before = (await service.findAll()).length;
      await service.remove('2');

      const after_remove: ReadonlyArray<Lesson> = await service.findAll();
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await service.findOne('2')).toBeUndefined();
    });

    it('should leave the vocabulary unchanged if the id does not exist', async () => {
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository;
      await service.remove('0');
      expect(await service.findAll()).toEqual(expected_result);
    });
  });

  describe('create', () => {
    it('should add the lesson to the repository', async () => {
      const lesson_in: CreateLessonDto = {
        user: addLesson.user,
        title: addLesson.title,
        language_a: addLesson.language_a,
        language_b: addLesson.language_b,
      };

      const result: Lesson = await service.create(lesson_in);

      expect(result.user).toEqual(addLesson.user);
      expect(result.title).toEqual(addLesson.title);
      expect(result.language_a).toEqual(addLesson.language_a);
      expect(result.language_b).toEqual(addLesson.language_b);

      const allLessons = await service.findAll();

      //ToDo improve search
      const searchResult: Lesson = allLessons.find(
        lesson => lesson.language_a === addLesson.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    const updateCheck = async () => {
      const allLessons = await service.findAll();
      const searchResult: Lesson = allLessons.find(
        lesson => lesson.id === updateLesson.id,
      );
      expect(searchResult).toBeDefined();
      expect(searchResult.id).toBe(updateLesson.id);
      expect(searchResult.user).toBe(updateLesson.user);
      expect(searchResult.title).toBe(updateLesson.title);
      expect(searchResult.language_a).toBe(updateLesson.language_a);
      expect(searchResult.language_b).toBe(updateLesson.language_b);
    };

    it('should update the lesson', async () => {
      const lesson_in: UpdateLessonDto = {
        title: updateLesson.title,
        language_a: updateLesson.language_a,
        language_b: updateLesson.language_b,
      };

      await service.update(updateLesson.id.toString(), lesson_in);
      updateCheck();
    });

    it('should update the lesson with partial information - language_a empty', async () => {
      const lesson_in: UpdateLessonDto = {
        title: '',
        language_a: '',
        language_b: updateLesson.language_b,
      };

      await service.update(updateLesson.id.toString(), lesson_in);
      updateCheck();
    });

    it('should update the vocabulary with partial information - language_a & b empty', async () => {
      const lesson_in: UpdateLessonDto = {
        title: updateLesson.title,
        language_a: '',
        language_b: '',
      };
      await service.update(updateLesson.id.toString(), lesson_in);
      updateCheck();
    });
  });
});
