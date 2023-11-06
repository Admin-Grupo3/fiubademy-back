import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamTaken1699299776167 implements MigrationInterface {
    name = 'AddExamTaken1699299776167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "exams_taken" jsonb NOT NULL DEFAULT '[]'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "exams_taken"
        `);
    }

}
