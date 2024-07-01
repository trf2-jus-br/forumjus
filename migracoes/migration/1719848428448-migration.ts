import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848428448 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table statement drop statement_acceptance_datetime;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
