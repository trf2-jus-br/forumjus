import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720036957843 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Essa visão não deveria existir, foi criada em momento crítico.
        await queryRunner.query(`CREATE VIEW votacao_detalhada_2 AS SELECT * FROM votacao_detalhada;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
