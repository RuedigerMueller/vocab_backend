import { Vocabulary } from './vocabulary.entity';
import {
  initialVocabularyRepository,
  addVocabulary,
} from './vocabulary.test.data';
import { FindManyOptions } from 'typeorm';

export class VocabularyRepositoryMock {
  private _repository: ReadonlyArray<Vocabulary> = [];

  constructor() {
    this._repository = this._repository.concat(initialVocabularyRepository);
  }

  /*
  async find(options?: FindManyOptions<any>): Promise<Vocabulary[]> {
    if (!options) {
      return this._repository.map(obj => ({ ...obj }));
    } else {
      const result: Array<Vocabulary> = initialVocabularyRepository.filter(
        vocab => {
          if (vocab.id === 1 || vocab.id === 2) {
            return false;
          } else {
            return true;
          }
        },
      );
      return result;
    }
  }
*/
  async find(): Promise<Vocabulary[]> {
    return this._repository.map(obj => ({ ...obj }));
  }

  async findOne(id: string): Promise<Vocabulary> {
    return this._repository.find(vocab => vocab.id === parseInt(id));
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
    const before: Vocabulary = await this.findOne(id);
    vocab.id = parseInt(id);
    vocab.language_a = vocab.language_a ? vocab.language_a : before.language_a;
    vocab.language_b = vocab.language_b ? vocab.language_b : before.language_b;
    vocab.level = vocab.level ? vocab.level : before.level;
    vocab.dueDate = before.dueDate;
    await this.delete(id);
    this._repository = this._repository.concat(vocab);
  }
}
