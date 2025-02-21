import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740160495973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO configuracao (id, nome, valor) VALUES 
            (19, 'QUORUM_APROVACAO_COMISSAO', 0.666666),
            (20, 'QUORUM_APROVACAO_PLENARIA', 0.666667);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
