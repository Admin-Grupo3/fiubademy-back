import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserData1700000102515 implements MigrationInterface {
    name = 'FixUserData1700000102515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_ef2fb839248017665e5033e7307"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_0408cb491623b121499d4fa2385"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_0408cb491623b121499d4fa2385" UNIQUE ("last_name")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_ef2fb839248017665e5033e7307" UNIQUE ("first_name")
        `);
    }

}
