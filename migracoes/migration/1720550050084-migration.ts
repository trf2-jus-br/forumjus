import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720550050084 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `INSERT INTO configuracao (id, nome, valor) VALUES (12, 'NOME_ARTIGO', 'a');`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
