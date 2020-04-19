import { Vocabulary } from './vocabulary.entity';
import { Lesson } from '../lessons/lesson.entity';
import { initialLessonRepository } from '../lessons/lessons.test.data';

function createVocabulary(
  id: number,
  language_a: string,
  language_b: string,
  level: number,
  dueDate: Date,
  lesson: Lesson,
): Vocabulary {
  const vocabulary: Vocabulary = new Vocabulary();
  vocabulary.id = id;
  vocabulary.language_a = language_a;
  vocabulary.language_b = language_b;
  vocabulary.level = level;
  vocabulary.dueDate = dueDate;
  vocabulary.lesson = lesson;
  return vocabulary;
}

const lesson: Lesson = initialLessonRepository.find(lesson => lesson.id === 1);

export let initialVocabularyRepository: ReadonlyArray<Vocabulary> = [];

initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(1, 'house', 'Haus', 1, new Date(2020, 2, 29), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(2, 'mouse', 'Maus', 2, new Date(2020, 3, 1), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(3, 'key', 'Schlüssel', 1, new Date(9999, 12, 31), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(4, 'city', 'Stadt', 1, new Date(9999, 12, 31), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(5, 'car', 'Auto', 7, new Date(9999, 12, 31), lesson),
);
initialVocabularyRepository = initialVocabularyRepository.concat(
  createVocabulary(6, 'sausage', 'Wurst', 1, new Date(9999, 12, 31), lesson),
);

let dueDate = new Date();
dueDate.setHours(0,0,0,0);
export const addVocabulary: Vocabulary = createVocabulary(
  10,
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
