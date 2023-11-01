import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExams1698692021498 implements MigrationInterface {
    name = 'AddExams1698692021498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "courses-questions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "question" character varying(255) NOT NULL,
                "answers" jsonb NOT NULL DEFAULT '[]',
                "correct_answer_id" character varying(255) NOT NULL,
                "exam_id" uuid,
                CONSTRAINT "PK_f6bae21001c8fbecf9e05c448fd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "courses-exams" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" character varying(255) DEFAULT '',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "course_id" uuid,
                CONSTRAINT "PK_207ac58e172d10475ef280080b8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "courses-questions"
            ADD CONSTRAINT "FK_db65d405faec66a4ded42315b91" FOREIGN KEY ("exam_id") REFERENCES "courses-exams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses-exams"
            ADD CONSTRAINT "FK_a074cd667257d4c718b991cedd8" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses-exams" DROP CONSTRAINT "FK_a074cd667257d4c718b991cedd8"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses-questions" DROP CONSTRAINT "FK_db65d405faec66a4ded42315b91"
        `);
        await queryRunner.query(`
            DROP TABLE "courses-exams"
        `);
        await queryRunner.query(`
            DROP TABLE "courses-questions"
        `);
    }

}
