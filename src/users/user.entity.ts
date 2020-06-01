/* istanbul ignore file */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Vocabulary } from "src/vocabulary/vocabulary.entity";
import { Lesson } from "src/lessons/lesson.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @OneToMany(
        type => Vocabulary,
        vocabulary => vocabulary.user,
        {
            eager: false,
        },
    )
    vocabulary: ReadonlyArray<Vocabulary>;

    @OneToMany(
        type => Lesson,
        lesson => lesson.user,
        {
            eager: false,
        },
    )
    lessons: ReadonlyArray<Lesson>;


    access_token: string;
}