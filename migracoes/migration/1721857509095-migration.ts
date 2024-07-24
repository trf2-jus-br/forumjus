import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721857509095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE committee ADD sala varchar(128);`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
