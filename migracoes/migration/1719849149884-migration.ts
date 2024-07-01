import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849149884 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE votacao ADD cronometro INT;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
