import { Lesson } from './lesson.entity';
import { User } from 'src/users/user.entity';
import { initialUserRepository } from 'src/users/user.test.data';

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

const user_1: User = initialUserRepository.find(user => user.id === 1);
const user_2: User = initialUserRepository.find(user => user.id === 1);


export let initialLessonRepository: ReadonlyArray<Lesson> = [];

initialLessonRepository = initialLessonRepository.concat(
  createLesson(1, user_1, 'Lesson 1', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(2, user_1, 'Lesson 2', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(3, user_1, 'Lesson 3', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(4, user_1, 'Unidad 1', 'Español', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(5, user_1, 'Lektion 1', 'Deutsch', 'Español'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(6, user_2, 'Lesson 2', 'Español', 'Deutsch'),
);

export const addLesson: Lesson = createLesson(
  7,
  user_1,
  'Lesson 4',
  'English',
  'Deutsch',
);

export const updateLesson: Lesson = initialLessonRepository.find(
  lesson => lesson.id === 2,
);
