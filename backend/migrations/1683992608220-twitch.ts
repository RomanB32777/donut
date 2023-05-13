import { MigrationInterface, QueryRunner } from 'typeorm'

export class twitch1683992608220 implements MigrationInterface {
	name = 'twitch1683992608220'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "creators" ADD "twitch_banner" character varying DEFAULT ''`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "creators" DROP COLUMN "twitch_banner"`)
	}
}
