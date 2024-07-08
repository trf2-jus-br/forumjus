import { MigrationInterface, QueryRunner } from "typeorm";
import { esquemaAtual } from "../esquemas";

export class Migration1720458243364 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // A base `trfForumJus` foi criada antes da implementação das migrações e já contém dados.
        // Esta migração irá alterar o banco para que a base `trfForumJus` esteja no mesmo estágio que as demais bases.
        const db = await esquemaAtual(queryRunner);
        
        // garante que esta migração seja executada apenas uma vez.
        if(db !== "trfForumJus")        
            return;

        // define quais migrações presisam ser executados pelo esquema 'trfForumJus'
        await queryRunner.query(`DELETE FROM trfForumJus.migrations WHERE name = 'Migration1719847056546';`);
        await queryRunner.query(`DELETE FROM trfForumJus.migrations WHERE name = 'Migration1719944093178';`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
