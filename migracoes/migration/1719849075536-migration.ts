import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849075536 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE presenca (
                id INT NOT NULL AUTO_INCREMENT,
                membro BIGINT NOT NULL,
                entrada DATETIME DEFAULT NOW(),
                saida DATETIME,
                
                PRIMARY KEY(id),
                FOREIGN KEY(membro) REFERENCES membro(id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
