import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVideo1699828363791 implements MigrationInterface {
    name = 'AddVideo1699828363791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "video" character varying DEFAULT ''
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "video"
        `);
    }

}
