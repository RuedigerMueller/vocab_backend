import { User } from 'src/users/user.entity';
import { Lesson } from '../lessons/lesson.entity';
import { initialLessonRepository } from '../lessons/lessons.test.data';
import { Vocabulary } from './vocabulary.entity';

function createVocabulary(
  id: number,
  user: User,
  language_a: string,
  language_b: string,
  level: number,
  dueDate: Date,
  lesson: Lesson,
): Vocabulary {
  const vocabulary: Vocabulary = new Vocabulary();
  vocabulary.id = id;
  vocabulary.user = user
  vocabulary.language_a = language_a;
  vocabulary.language_b = language_b;
  vocabulary.level = level;
  vocabulary.dueDate = dueDate;
  vocabulary.lesson = lesson;
  return vocabulary;
}

//const user: User = initialUserRepository.find(user => user.id === 1);
const lesson: Lesson = initialLessonRepository.find(lesson => lesson.id === 1);
const user: User = lesson.user;

export let initialVocabularyRepository: ReadonlyArray<Vocabulary> = [];

initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(1, user, 'house', 'Haus', 1, new Date(2020, 2, 29), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(2, user, 'mouse', 'Maus', 2, new Date(2020, 3, 1), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(3, user, 'key', 'Schlüssel', 1, new Date(9999, 12, 31), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(4, user, 'city', 'Stadt', 1, new Date(9999, 12, 31), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(5, user, 'car', 'Auto', 7, new Date(2020, 3, 1), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(6, user, 'sausage', 'Wurst', 1, new Date(9999, 12, 31), lesson),
);

let dueDate = new Date();
dueDate.setHours(0,0,0,0);
export const addVocabulary: Vocabulary = createVocabulary(
  10,
  user,
  'pineapple',
  'Ananas',
  1,
  dueDate,
  lesson,
);

export const updateVocabulary: Vocabulary = initialVocabularyRepository.find(
  vocab => vocab.id === 2,
);
export const updateVocabulary_LevelTooHighTest: Vocabulary = initialVocabularyRepository.find(
  vocab => vocab.id === 5,
);
export const updateVocabulary_LevelTooLowTest: Vocabulary = initialVocabularyRepository.find(
  vocab => vocab.id === 6,
);

export const knownVocabulary: Vocabulary = initialVocabularyRepository.find(
  vocab => vocab.id === 1,
);

export const unknownVocabulary: Vocabulary = initialVocabularyRepository.find(
  vocab => vocab.id === 2,
);
