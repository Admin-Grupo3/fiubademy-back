import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCourses1697508301621 implements MigrationInterface {
  name = 'AddCourses1697508301621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "languages" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_9c0e155475f0aa782e4a6178969" UNIQUE ("name"),
                CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "courses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "language_id" integer,
                CONSTRAINT "UQ_a01a7f0e38c6f16024d16058ab5" UNIQUE ("title"),
                CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"),
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "courses_categories_categories" (
                "courses_id" uuid NOT NULL,
                "categories_id" integer NOT NULL,
                CONSTRAINT "PK_e0698d60f5c39c102d48d39af9d" PRIMARY KEY ("courses_id", "categories_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8ebbd4cf7557a5d177995ce4d5" ON "courses_categories_categories" ("courses_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ed44e2633571a03c8298754e08" ON "courses_categories_categories" ("categories_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_a4396a5235f159ab156a6f8b603" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_56152b64d1919d1b2d8323477a0" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "courses_categories_categories"
            ADD CONSTRAINT "FK_8ebbd4cf7557a5d177995ce4d52" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "courses_categories_categories"
            ADD CONSTRAINT "FK_ed44e2633571a03c8298754e089" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "courses_categories_categories" DROP CONSTRAINT "FK_ed44e2633571a03c8298754e089"
        `);
    await queryRunner.query(`
            ALTER TABLE "courses_categories_categories" DROP CONSTRAINT "FK_8ebbd4cf7557a5d177995ce4d52"
        `);
    await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_56152b64d1919d1b2d8323477a0"
        `);
    await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_a4396a5235f159ab156a6f8b603"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ed44e2633571a03c8298754e08"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8ebbd4cf7557a5d177995ce4d5"
        `);
    await queryRunner.query(`
            DROP TABLE "courses_categories_categories"
        `);
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
    await queryRunner.query(`
            DROP TABLE "courses"
        `);
    await queryRunner.query(`
            DROP TABLE "languages"
        `);
  }
}
