import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLearningPaths1699323572768 implements MigrationInterface {
    name = 'AddLearningPaths1699323572768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "learning-paths" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "description" character varying(255) DEFAULT '',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "creator_id" uuid,
                CONSTRAINT "UQ_61a59e44261fe3395c813a61eb3" UNIQUE ("title"),
                CONSTRAINT "PK_4a335d107a8323acc0554a70959" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "learning-paths_courses_courses" (
                "learning-paths_id" uuid NOT NULL,
                "courses_id" uuid NOT NULL,
                CONSTRAINT "PK_51cbeb033832992efba8925573b" PRIMARY KEY ("learning-paths_id", "courses_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_7ef6aaa471bdf05bc06a606b51" ON "learning-paths_courses_courses" ("learning-paths_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_cf876b170269f39f25143fcb16" ON "learning-paths_courses_courses" ("courses_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "learning-paths"
            ADD CONSTRAINT "FK_a3b134e73c014c9dd71164b2496" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "learning-paths_courses_courses"
            ADD CONSTRAINT "FK_7ef6aaa471bdf05bc06a606b517" FOREIGN KEY ("learning-paths_id") REFERENCES "learning-paths"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "learning-paths_courses_courses"
            ADD CONSTRAINT "FK_cf876b170269f39f25143fcb165" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "learning-paths_courses_courses" DROP CONSTRAINT "FK_cf876b170269f39f25143fcb165"
        `);
        await queryRunner.query(`
            ALTER TABLE "learning-paths_courses_courses" DROP CONSTRAINT "FK_7ef6aaa471bdf05bc06a606b517"
        `);
        await queryRunner.query(`
            ALTER TABLE "learning-paths" DROP CONSTRAINT "FK_a3b134e73c014c9dd71164b2496"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_cf876b170269f39f25143fcb16"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_7ef6aaa471bdf05bc06a606b51"
        `);
        await queryRunner.query(`
            DROP TABLE "learning-paths_courses_courses"
        `);
        await queryRunner.query(`
            DROP TABLE "learning-paths"
        `);
    }

}
