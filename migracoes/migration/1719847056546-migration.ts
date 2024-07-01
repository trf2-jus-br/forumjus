import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719847056546 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE configuracao (
                id int,
                nome varchar(100),

                PRIMARY KEY(id)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
