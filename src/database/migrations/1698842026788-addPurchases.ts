import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurchases1698842026788 implements MigrationInterface {
    name = 'AddPurchases1698842026788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "purchases" (
                "id" SERIAL NOT NULL,
                "purchase_date" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "course_id" uuid,
                CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "purchases"
            ADD CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "purchases"
            ADD CONSTRAINT "FK_69e6c77f4f1b4dbdbcc218157d9" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "purchases" DROP CONSTRAINT "FK_69e6c77f4f1b4dbdbcc218157d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "purchases" DROP CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a"
        `);
        await queryRunner.query(`
            DROP TABLE "purchases"
        `);
    }

}
