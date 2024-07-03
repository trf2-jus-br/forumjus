import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849193675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE juncao (
                id INT NOT NULL AUTO_INCREMENT,
                codigo INT NOT NULL,
                comite INT NOT NULL,
                texto VARCHAR(1024) NOT NULL,
                justificativa VARCHAR(2048) NOT NULL,

                FOREIGN KEY (comite) REFERENCES committee (committee_id),
                PRIMARY KEY (id)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.query(`DROP TABLE juncao;`)
    }

}
