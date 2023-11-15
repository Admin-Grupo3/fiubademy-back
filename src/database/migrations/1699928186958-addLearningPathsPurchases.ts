import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLearningPathsPurchases1699928186958 implements MigrationInterface {
    name = 'AddLearningPathsPurchases1699928186958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "learningPathPurchases" (
                "id" SERIAL NOT NULL,
                "purchase_date" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "learning_path_id" uuid,
                CONSTRAINT "PK_386f32580c67de3379edbd66c31" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "learningPathPurchases"
            ADD CONSTRAINT "FK_d4cd969f22b6adbcd5de042c642" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "learningPathPurchases"
            ADD CONSTRAINT "FK_4d4475c650078393118d230d8c3" FOREIGN KEY ("learning_path_id") REFERENCES "learning-paths"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "learningPathPurchases" DROP CONSTRAINT "FK_4d4475c650078393118d230d8c3"
        `);
        await queryRunner.query(`
            ALTER TABLE "learningPathPurchases" DROP CONSTRAINT "FK_d4cd969f22b6adbcd5de042c642"
        `);
        await queryRunner.query(`
            DROP TABLE "learningPathPurchases"
        `);
    }

}
