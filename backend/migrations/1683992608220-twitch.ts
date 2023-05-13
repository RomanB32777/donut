import { MigrationInterface, QueryRunner } from "typeorm";

export class twitch1683992608220 implements MigrationInterface {
    name = 'twitch1683992608220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stats" RENAME COLUMN "text_alignment" TO "text_alignment2"`);
        await queryRunner.query(`ALTER TYPE "public"."stats_text_alignment_enum" RENAME TO "stats_text_alignment2_enum"`);
        await queryRunner.query(`ALTER TABLE "creators" RENAME COLUMN "test_color" TO "twitch_banner"`);
        await queryRunner.query(`ALTER TABLE "creators" ALTER COLUMN "twitch_banner" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creators" ALTER COLUMN "twitch_banner" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creators" ALTER COLUMN "twitch_banner" SET DEFAULT '#E94560'`);
        await queryRunner.query(`ALTER TABLE "creators" ALTER COLUMN "twitch_banner" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creators" RENAME COLUMN "twitch_banner" TO "test_color"`);
        await queryRunner.query(`ALTER TYPE "public"."stats_text_alignment2_enum" RENAME TO "stats_text_alignment_enum"`);
        await queryRunner.query(`ALTER TABLE "stats" RENAME COLUMN "text_alignment2" TO "text_alignment"`);
    }

}
