import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserData1699977739382 implements MigrationInterface {
    name = 'AddUserData1699977739382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users_interests_categories" (
                "users_id" uuid NOT NULL,
                "categories_id" integer NOT NULL,
                CONSTRAINT "PK_4173b1717fe8d55f06295b132bd" PRIMARY KEY ("users_id", "categories_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ce3b14232e96307f16f19f12f3" ON "users_interests_categories" ("users_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1c08ac9c6f2216e1e025ff3c25" ON "users_interests_categories" ("categories_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "birth_date" date
        `);
        await queryRunner.query(`
            ALTER TABLE "users_interests_categories"
            ADD CONSTRAINT "FK_ce3b14232e96307f16f19f12f31" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "users_interests_categories"
            ADD CONSTRAINT "FK_1c08ac9c6f2216e1e025ff3c252" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users_interests_categories" DROP CONSTRAINT "FK_1c08ac9c6f2216e1e025ff3c252"
        `);
        await queryRunner.query(`
            ALTER TABLE "users_interests_categories" DROP CONSTRAINT "FK_ce3b14232e96307f16f19f12f31"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "birth_date"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_1c08ac9c6f2216e1e025ff3c25"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ce3b14232e96307f16f19f12f3"
        `);
        await queryRunner.query(`
            DROP TABLE "users_interests_categories"
        `);
    }

}
