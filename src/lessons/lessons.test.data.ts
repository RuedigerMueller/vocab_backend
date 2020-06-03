import { User } from '../users/user.entity';
import { initialUserRepository } from '../users/user.test.data';
import { Lesson } from './lesson.entity';

function createLesson(
  id: number,
  user: User,
  title: string,
  language_a: string,
  language_b: string,
): Lesson {
  const lesson: Lesson = new Lesson();
  lesson.id = id;
  lesson.user = user;
  lesson.title = title;
  lesson.language_a = language_a;
  lesson.language_b = language_b;
  return lesson;
}

export const lessonUser_1: User = initialUserRepository.find(user => user.id === 1);
export const lessonUser_2: User = initialUserRepository.find(user => user.id === 2);

export let initialLessonRepository: ReadonlyArray<Lesson> = [];

initialLessonRepository = initialLessonRepository.concat(
  createLesson(1, lessonUser_1, 'Lesson 1', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(2, lessonUser_1, 'Lesson 2', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(3, lessonUser_1, 'Lesson 3', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(4, lessonUser_1, 'Unidad 1', 'Español', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(5, lessonUser_1, 'Lektion 1', 'Deutsch', 'Español'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(6, lessonUser_2, 'Lesson 2', 'Español', 'Deutsch'),
);

export const addLesson: Lesson = createLesson(
  7,
  lessonUser_1,
  'Lesson 4',
  'English',
  'Deutsch',
);

export const updateLesson: Lesson = initialLessonRepository.find(
  lesson => lesson.id === 2,
);
