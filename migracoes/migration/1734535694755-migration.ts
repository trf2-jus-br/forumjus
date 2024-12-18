import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734535694755 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO configuracao (id, nome, valor) VALUES (18, 'CAPA_GENERICA_CADERNO', null);`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
