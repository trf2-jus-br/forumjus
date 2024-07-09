import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720543952949 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO configuracao (id, nome, valor) VALUES 
                ( 4, 'PORTAL', '#########################' ),
                ( 5, 'PORTAL_LINK', '#########################' ),
                ( 6, 'REGULAMENTO', '#########################' ),
                ( 7, 'EMAIL_ORGANIZACAO', '#########################' ),
                ( 8, 'CAPAS_PREFIXO', '#########################' ),
                ( 9, 'LOCAL_EVENTO', '#########################' ),
                ( 10, 'NOME_REDUZIDO', '#########################' ),
                ( 11, 'REGULAMENTO_PORTARIA', '#########################' );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }
}
