import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848486339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table statement drop statement_rejection_datetime;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
