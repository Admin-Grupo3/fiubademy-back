import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserName1699902320105 implements MigrationInterface {
    name = 'AddUserName1699902320105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(255)
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(255)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    }

}
