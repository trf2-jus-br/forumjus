import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848502578 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table statement add data_analise datetime;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
