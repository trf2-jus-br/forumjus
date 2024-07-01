import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848830382 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE votacao (
                id BIGINT NOT NULL AUTO_INCREMENT,
                enunciado INT NOT NULL,
                inicio DATETIME NOT NULL DEFAULT (NOW()),
                fim DATETIME,
                iniciada_por BIGINT NOT NULL,
                
                FOREIGN KEY(enunciado) REFERENCES statement(statement_id),
                FOREIGN KEY(iniciada_por) REFERENCES membro(id),
                
                PRIMARY KEY(id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
