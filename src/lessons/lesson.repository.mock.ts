import { Lesson } from './lesson.entity';
import { initialLessonRepository, addLesson } from './lessons.test.data';
import { FindManyOptions } from 'typeorm';

export class LessonRepositoryMock {
  private _repository: ReadonlyArray<Lesson> = [];

  constructor() {
    this._repository = this._repository.concat(initialLessonRepository);
  }

  async find(options?: FindManyOptions<any>): Promise<ReadonlyArray<Lesson>> {
    //if(!options) {
    return this._repository; 
    //}
    /*else {
            const result: Array<Lesson> = initialLessonRepository.filter(lesson => {
                if((lesson.id === 1) || (lesson.id === 2)) {
                  return false;
                } else {
                  return true;
                }
              });
              return result;
        }
        */
  }

  async findOne(id: string): Promise<Lesson> {
    return this._repository.find(lesson => lesson.id === parseInt(id));
  }

  async delete(id: string): Promise<void> {
    this._repository = this._repository.filter(lesson => {
      if (lesson.id === parseInt(id)) {
        return false;
      } else {
        return true;
      }
    });
    return;
  }

  async save(lesson: Lesson): Promise<Lesson> {
    lesson.id = addLesson.id;
    this._repository = this._repository.concat(lesson);
    return lesson;
  }

  async update(id: string, lesson: Lesson) {
    const before: Lesson = await this.findOne(id);
    lesson.id = parseInt(id);
    lesson.user = before.user;
    lesson.title = lesson.title ? lesson.title : before.title;
    lesson.language_a = lesson.language_a
      ? lesson.language_a
      : before.language_a;
    lesson.language_b = lesson.language_b
      ? lesson.language_b
      : before.language_b;
    await this.delete(id);
    this._repository = this._repository.concat(lesson);
  }
}
