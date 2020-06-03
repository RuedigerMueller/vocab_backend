import { User } from 'src/users/user.entity';
import { Vocabulary } from './vocabulary.entity';
import { addVocabulary, initialVocabularyRepository } from './vocabulary.test.data';

export class VocabularyRepositoryMock {
  private _repository: ReadonlyArray<Vocabulary> = [];

  constructor() {
    this._repository = this._repository.concat(initialVocabularyRepository);
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
  
  async find(query: string): Promise<Vocabulary[]> {
    const user: User = this.getUserfromQUery(query);

    return this._repository.filter(vocabulary => {
      if (vocabulary.user.id === user.id) {
        return true;
      } else {
        return false;
      }
    });
  }

  async findOne(query: string): Promise<Vocabulary> {
    const id: number = this.getIDfromQuery(query);
    const user: User = this.getUserfromQUery(query);
    return this._repository.find(vocabulary => {
      if ((vocabulary.id === id) && (vocabulary.user.id === user.id)) {
        return true;
      } else {
        return false;
      }
    });
  }

  async delete(id: string): Promise<void> {
    this._repository = this._repository.filter(vocab => {
      if (vocab.id === parseInt(id)) {
        return false;
      } else {
        return true;
      }
    });
    return;
  }

  async save(vocabulary: Vocabulary): Promise<Vocabulary> {
    vocabulary.id = addVocabulary.id;
    this._repository = this._repository.concat(vocabulary);
    return vocabulary;
  }

  async update(id: string, vocab: Vocabulary) {
    const before: Vocabulary = this._repository.find(vocabulary => {
      if ((vocabulary.id === parseInt(id))) {
        return true;
      } else {
        return false;
      }
    });
    vocab.id = parseInt(id);
    vocab.language_a = vocab.language_a ? vocab.language_a : before.language_a;
    vocab.language_b = vocab.language_b ? vocab.language_b : before.language_b;
    vocab.level = vocab.level ? vocab.level : before.level;
    vocab.dueDate = before.dueDate;
    await this.delete(id);
    this._repository = this._repository.concat(vocab);
  }
}
