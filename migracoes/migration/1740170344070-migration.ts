import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740170344070 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Havia um bug que atualizava indiscriminadamente o campo 'fim' nas votações das comissões.
        // Esta consulta atenua o erro, alterando o 'fim' para a data da ultima 'alteração' da votação.
        await queryRunner.query(
            `UPDATE votacao 
            JOIN votacao_detalhada ON votacao_detalhada.id = votacao.id
            SET votacao.fim = votacao.alterado
            WHERE evento = 'VOTAÇÃO POR COMISSÃO' AND NOT EXISTS (
                SELECT V.committee_id, max(V.id) as max_id 
                FROM votacao_detalhada V 
                WHERE V.evento = 'VOTAÇÃO POR COMISSÃO'
                GROUP BY V.committee_id 
                HAVING max_id = votacao_detalhada.id
                ORDER BY V.committee_id ASC
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
