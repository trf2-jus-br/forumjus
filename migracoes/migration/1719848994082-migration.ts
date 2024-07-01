import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848994082 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE statement ADD justificativa_analise VARCHAR(512) DEFAULT NULL;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
