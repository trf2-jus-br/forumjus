import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848633323 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE attendee DROP FOREIGN KEY attendee_ibfk_3;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
