import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';
import { LessonRepositoryMock } from './lesson.repository.mock';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { addLesson, initialLessonRepository, lessonUser_1, lessonUser_2, updateLesson } from './lessons.test.data';

describe('Lessons Controller', () => {
  let controller: LessonsController;
  const http = require('http');
  const request = new http.IncomingMessage();
  request.user = lessonUser_1;

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
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository.filter(
        lesson => {
          if (lesson.user === lessonUser_1) {
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
    it('should return the one lesson we are requesting', async () => {
      const expected_result: Lesson = initialLessonRepository.find(
        lesson => lesson.id === 2,
      );
      expect(await controller.findOne(request, '2')).toEqual(expected_result);
    });

    it('should not find a valid ID but from different user', async () => {
      expect(await controller.findOne(request, '6')).toBeUndefined();
    });

    it('should be undefined if the id does not exist', async () => {
      expect(await controller.findOne(request, '0')).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove the lesson', async () => {
      // we will be deleting the lesson with the ID 2
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository.filter(
        lesson => {
          if ((lesson.id === 2) || (lesson.user.id !== lessonUser_1.id)) {
            return false;
          } else {
            return true;
          }
        },
      );

      const entries_before = await (await controller.findAll(request)).length;
      await controller.remove(request, '2');

      const after_remove: ReadonlyArray<Lesson> = await controller.findAll(request);
      expect(after_remove).toEqual(expected_result);
      expect(after_remove.length).toEqual(entries_before - 1);
      expect(await controller.findOne(request, '2')).toBeUndefined();
    });

    it('should not remove a valid ID but from different user', async () => {
      const request_user_2 = new http.IncomingMessage();
      request_user_2.user = lessonUser_2;
      expect(await controller.findOne(request_user_2, '6')).toBeDefined();

      await controller.remove(request, '6');

      expect(await controller.findOne(request_user_2, '6')).toBeDefined();
    });

    it('should leave the vocabulary unchanged if the id does not exist', async () => {
      const expected_result: ReadonlyArray<Lesson> = initialLessonRepository.filter(
        lesson => {
          if (lesson.user.id !== lessonUser_1.id) {
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
    it('should add the lesson to the repository', async () => {
      const lesson: CreateLessonDto = addLesson;

      await controller.create(request, lesson);

      const allLessons = await controller.findAll(request);
      //Todo Improve search
      const searchResult: Lesson = allLessons.find(
        lesson => lesson.language_a === addLesson.language_a,
      );
      expect(searchResult).toBeDefined();
    });
  });

  describe('update', () => {
    const updateCheck = async () => {
      const allLessons = await controller.findAll(request);
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
      const lesson: UpdateLessonDto = updateLesson;
      await controller.update(request, updateLesson.id.toString(), lesson);
      updateCheck();
    });

    it('should not update a valid ID but from different user', async () => {
      const lesson_before: Lesson = await controller.findOne(request, updateLesson.id.toString());
      const lesson_in: UpdateLessonDto = updateLesson;
      const request_user_2 = new http.IncomingMessage();
      request_user_2.user = lessonUser_2;

      await controller.update(request_user_2, updateLesson.id.toString(), lesson_in);

      const lesson_after: Lesson = await controller.findOne(request, updateLesson.id.toString());
      expect(lesson_before).toEqual(lesson_after);
    });

    it('should update the lesson with partial information - language_a empty', async () => {
      const lesson_in: UpdateLessonDto = {
        title: '',
        language_a: '',
        language_b: updateLesson.language_b,
      };

      await controller.update(request, updateLesson.id.toString(), lesson_in);
      updateCheck();
    });

    it('should update the vocabulary with partial information - language_a & b empty', async () => {
      const lesson_in: UpdateLessonDto = {
        title: updateLesson.title,
        language_a: '',
        language_b: '',
      };
      await controller.update(request, updateLesson.id.toString(), lesson_in);
      updateCheck();
    });
  });
});
