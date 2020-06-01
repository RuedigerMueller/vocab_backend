import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangingUser1590945414010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "user" TO "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "user"`);
    }

}
