import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719847998403 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE forum (
            forum_id INT NOT NULL AUTO_INCREMENT,
            forum_name VARCHAR(255) NOT NULL,
            PRIMARY KEY (forum_id));`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
