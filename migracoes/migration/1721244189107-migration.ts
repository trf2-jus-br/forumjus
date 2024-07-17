import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721244189107 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE arquivo (
                id varchar(128) NOT NULL,
                tipo varchar(64),
                caminho varchar(512),
                
                primary key(id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
