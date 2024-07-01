import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848518311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`alter table statement add admitido int default null;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
