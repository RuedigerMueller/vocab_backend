import { User } from 'src/users/user.entity';
import { Lesson } from './lesson.entity';
import { addLesson, initialLessonRepository } from './lessons.test.data';

export class LessonRepositoryMock {
  private _repository: ReadonlyArray<Lesson> = [];

  constructor() {
    this._repository = this._repository.concat(initialLessonRepository);
  }

  getIDfromQuery(query: string): number {
    // { where: { id: '0', username: 'john' } }
    const conditions: string = query['where'];
    return parseInt(conditions['id']);
  }

  getUserfromQUery(query: string): User {
     // { where: { id: '0', username: 'john' } }
     const conditions: string = query['where'];
    return conditions['user'];
  }

  async find(query: string): Promise<ReadonlyArray<Lesson>> {
    const user: User = this.getUserfromQUery(query);

    return this._repository.filter(lesson => {
      if (lesson.user.id === user.id) {
        return true;
      } else {
        return false;
      }
    });
  }

  async findOne(query: string): Promise<Lesson> {
    const id: number = this.getIDfromQuery(query);
    const user: User = this.getUserfromQUery(query);
    return this._repository.find(lesson => {
      if ((lesson.id === id) && (lesson.user.id === user.id)) {
        return true;
      } else {
        return false;
      }
    });
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
    const before: Lesson = this._repository.find(lesson => {
      if ((lesson.id === parseInt(id))) {
        return true;
      } else {
        return false;
      }
    });
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
