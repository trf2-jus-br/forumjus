import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848950512 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO calendario (evento, inicio, fim) VALUES 
            ( 'INSCRIÇÕES', '2023-10-09T18:07', '2023-11-26 23:59'),
            ( 'HOMOLOGAÇÃO', '2023-10-09T18:07', '2024-11-26 18:07'),
            ( 'VOTAÇÃO POR COMISSÃO', '2023-10-30 00:00:01', '2023-10-30 23:59:59'),
            ( 'VOTAÇÃO GERAL', '2023-10-31 00:00:01', '2023-10-31 23:59:59');`
       );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
