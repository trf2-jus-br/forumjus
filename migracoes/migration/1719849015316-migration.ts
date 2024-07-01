import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849015316 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE attendee ADD attendee_timestamp timestamp DEFAULT current_timestamp;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
