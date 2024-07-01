import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848746544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE statement ADD COLUMN codigo INT;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
