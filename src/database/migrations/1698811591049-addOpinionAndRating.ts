import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOpinionAndRating1698811591049 implements MigrationInterface {
    name = 'AddOpinionAndRating1698811591049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "courses_opinions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "opinion" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "course_id" uuid,
                CONSTRAINT "PK_e7d093d67df60bd5ae3b845c2ff" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "courses_rating" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating_star" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "course_id" uuid,
                CONSTRAINT "PK_7efbcf5dfbeb01562dbcdd2e35a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_opinions"
            ADD CONSTRAINT "FK_a070a9e3423bf8aa9ddbf0655b6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_opinions"
            ADD CONSTRAINT "FK_18297200a489de3700717c97e84" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_rating"
            ADD CONSTRAINT "FK_6395a67d2bf018bef198f2fd5b6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_rating"
            ADD CONSTRAINT "FK_38efb483e240c77a84b0aacac73" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses_rating" DROP CONSTRAINT "FK_38efb483e240c77a84b0aacac73"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_rating" DROP CONSTRAINT "FK_6395a67d2bf018bef198f2fd5b6"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_opinions" DROP CONSTRAINT "FK_18297200a489de3700717c97e84"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses_opinions" DROP CONSTRAINT "FK_a070a9e3423bf8aa9ddbf0655b6"
        `);
        await queryRunner.query(`
            DROP TABLE "courses_rating"
        `);
        await queryRunner.query(`
            DROP TABLE "courses_opinions"
        `);
    }

}
