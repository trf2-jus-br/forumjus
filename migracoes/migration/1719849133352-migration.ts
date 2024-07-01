import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849133352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE votacao ADD alterado DATETIME DEFAULT NOW();`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
