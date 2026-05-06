import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778029049430 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Contexto Histórico / Pendência Técnica.
        try{
            await queryRunner.query(
                `CREATE VIEW votacao_detalhada_2 AS SELECT * FROM votacao_detalhada;`
            )
        }catch(err){
            // A view já existe em alguns bancos, não quero substituir.
        }
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
