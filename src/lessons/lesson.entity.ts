/* istanbul ignore file */
import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Vocabulary } from '../vocabulary/vocabulary.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  /* @Column()
  username: string; */

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

  @ManyToOne(
    type => User,
    user => user.lessons,
  )
  user: User;

  numberDueVocables: number;
  numberVocables: number;

  @AfterLoad()
  updateStatistics() {
    this.numberVocables = this.vocabularies.length;

    const currentDate = new Date();
    const dueVocables: ReadonlyArray<Vocabulary> = this.vocabularies.filter(vocab => {
      return vocab.dueDate < currentDate;
    });
    this.numberDueVocables = dueVocables.length;
  }
}
