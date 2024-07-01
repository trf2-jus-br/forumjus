import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848649486 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE attendee DROP COLUMN committee_id;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
