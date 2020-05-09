/* istanbul ignore file */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity';

@Entity()
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language_a: string;

  @Column()
  language_b: string;

  @Column()
  level: number;

  @Column()
  dueDate: Date;

  @ManyToOne(
    type => Lesson,
    lesson => lesson.vocabularies,
  )
  lesson: Lesson;
}
