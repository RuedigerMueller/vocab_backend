import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { Lesson } from './lesson.entity';
import { LessonsService } from './lessons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessonRepositoryMock } from './lesson.repository.mock';
import {
  initialLessonRepository,
  addLesson,
  updateLesson,
} from './lessons.test.data';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

describe('Lessons Controller', () => {
  let controller: LessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useClass: LessonRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should find lessons', async () => {
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository;
      const result = await controller.findAll();

      expect(result).toEqual(expected_result);
      expect(result.length).toBe(expected_result.length);
    });
  });

  describe('findOne', () => {
    it('should return the one lesson we are requesting', async () => {
      const expected_result: Lesson = initialLessonRepository.find(
        lesson => lesson.id === 2,
      );
      expect(await controller.findOne('2')).toEqual(expected_result);
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await controller.findOne('0')).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove the lesson', async () => {
      // we will be deleting the lesson with the ID 2
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository.filter(
        lesson => {
          if (lesson.id === 2) {
            return false;
          } else {
            return true;
          }
        },
      );

      const entries_before = await (await controller.findAll()).length;
      await controller.remove('2');

      const after_remove: ReadonlyArray<Lesson> = await controller.findAll();
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await controller.findOne('2')).toBeUndefined();
    });

    it('should leave the vocabulary unchanged if the id does not exist', async () => {
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository;
      await controller.remove('0');
      expect(await controller.findAll()).toEqual(expected_result);
    });
  });

  describe('create', () => {
    it('should add the lesson to the repository', async () => {
      const lesson: CreateLessonDto = {
        user: addLesson.user,
        title: addLesson.title,
        language_a: addLesson.language_a,
        language_b: addLesson.language_a,
      };

      await controller.create(lesson);

      const allLessons = await controller.findAll();
      //Todo Improve search
      const searchResult: Lesson = allLessons.find(
        lesson => lesson.language_a === addLesson.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the lesson', async () => {
      const lesson: UpdateLessonDto = {
        title: updateLesson.title,
        language_a: updateLesson.language_a,
        language_b: updateLesson.language_b,
      };

      await controller.update(updateLesson.id.toString(), lesson);
      const allLessons = await controller.findAll();
      const searchResult: Lesson = allLessons.find(
        lesson => lesson.id === updateLesson.id,
      );
      expect(searchResult).toBeDefined();
      expect(searchResult.id).toBe(updateLesson.id);
      expect(searchResult.user).toBe(updateLesson.user);
      expect(searchResult.title).toStrictEqual(updateLesson.title);
      expect(searchResult.language_a).toBe(updateLesson.language_a);
      expect(searchResult.language_b).toBe(updateLesson.language_b);
    });
  });
});
