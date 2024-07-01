import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849056857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE votacao ADD status INT;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
