import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848866910 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE voter;`);
        await queryRunner.query(`DROP TABLE election;`);
        await queryRunner.query(`DROP TABLE candidate;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
