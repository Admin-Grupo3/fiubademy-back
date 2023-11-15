import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserName1699902320105 implements MigrationInterface {
    name = 'AddUserName1699902320105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_ef2fb839248017665e5033e7307" UNIQUE ("first_name")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_0408cb491623b121499d4fa2385" UNIQUE ("last_name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_0408cb491623b121499d4fa2385"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_ef2fb839248017665e5033e7307"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    }

}
