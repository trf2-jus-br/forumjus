import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849207000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE juncao_enunciado (
                enunciado INT NOT NULL,
                juncao INT NOT NULL,

                PRIMARY KEY (enunciado, juncao),
                FOREIGN KEY (enunciado) REFERENCES statement (statement_id),
                FOREIGN KEY (juncao) REFERENCES juncao (id)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.query(`DROP TABLE juncao_enunciado;`)
    }

}
