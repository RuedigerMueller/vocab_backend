import { Lesson } from './lesson.entity';

function createLesson(
  id: number,
  user: string,
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

export let initialLessonRepository: ReadonlyArray<Lesson> = [];

initialLessonRepository = initialLessonRepository.concat(
  createLesson(1, 'User1', 'Lesson 1', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(2, 'User1', 'Lesson 2', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(3, 'User1', 'Lesson 3', 'English', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(4, 'User1', 'Unidad 1', 'Español', 'Deutsch'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(5, 'User1', 'Lektion 1', 'Deutsch', 'Español'),
);
initialLessonRepository = initialLessonRepository.concat(
  createLesson(6, 'User2', 'Lesson 2', 'Español', 'Deutsch'),
);

export const addLesson: Lesson = createLesson(
  7,
  'User1',
  'Lesson 4',
  'English',
  'Deutsch',
);

export const updateLesson: Lesson = initialLessonRepository.find(
  lesson => lesson.id === 2,
);
