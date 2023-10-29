import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationsCourse1698181423795 implements MigrationInterface {
    name = 'FixRelationsCourse1698181423795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_a4396a5235f159ab156a6f8b603"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "description" character varying(255) DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "rating_count" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "rating_star" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "price" double precision NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "discount" double precision NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "image" character varying(255) DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "what_will_you_learn" character varying array NOT NULL DEFAULT '{}'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "content" character varying array NOT NULL DEFAULT '{}'
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "creator_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_26e311556137a012ebab1fc9845" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_26e311556137a012ebab1fc9845"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "creator_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "content"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "what_will_you_learn"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "image"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "discount"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "price"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "rating_star"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "rating_count"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD "user_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_a4396a5235f159ab156a6f8b603" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
