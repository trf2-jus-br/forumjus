import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722008330791 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE membro MODIFY COLUMN comite INT NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
