/* istanbul ignore file */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Vocabulary } from '../vocabularies/vocabulary.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  title: string;

  @Column()
  language_a: string;

  @Column()
  language_b: string;

  @OneToMany(
    type => Vocabulary,
    vocabulary => vocabulary.lesson,
    {
      eager: true,
    },
  )
  vocabularies: ReadonlyArray<Vocabulary>;

  numberDueVocables: number;
  numberVocables: number;

  @AfterLoad()
  updateStatistics() {
    this.numberVocables = this.vocabularies.length;
    
    const currentDate = new Date();
    const dueVocables: ReadonlyArray<Vocabulary> = this.vocabularies.filter( vocab => {
      return vocab.dueDate < currentDate;
    });
    this.numberDueVocables = dueVocables.length;
  }
}
