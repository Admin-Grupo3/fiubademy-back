import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyToCourses1699916174938 implements MigrationInterface {
    name = 'AddCompanyToCourses1699916174938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "company" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_ce0090229a82a1f31063f556bd0" UNIQUE ("title"),
                CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "company_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_fcb4308df0fe59417815b1ea021" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_fcb4308df0fe59417815b1ea021"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "company_id"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
    }

}
