import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848844775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE voto (
                id BIGINT NOT NULL AUTO_INCREMENT,
                votacao BIGINT NOT NULL,
                membro BIGINT NOT NULL,
                voto BIT NOT NULL,
                data DATETIME NOT NULL DEFAULT (NOW()),
                
                UNIQUE voto_unico (membro, votacao),
                
                FOREIGN KEY(votacao) REFERENCES votacao(id),
                FOREIGN KEY(membro) REFERENCES membro(id),
                
                PRIMARY KEY(id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
