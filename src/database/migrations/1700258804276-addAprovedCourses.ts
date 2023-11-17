import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAprovedCourses1700258804276 implements MigrationInterface {
    name = 'AddAprovedCourses1700258804276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "courses_approved" jsonb NOT NULL DEFAULT '[]'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "courses_approved"
        `);
    }

}
