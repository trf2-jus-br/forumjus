import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721244185497 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( 
            `INSERT INTO configuracao (id, nome, valor) VALUES 
                (13, 'DATA_LIMITE_ESCOLHA_COMISSAO', '04/03/2024'),
                (14, 'CRONOGRAMA_JSON', '{}');`
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
