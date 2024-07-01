import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719847918723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE election (
                election_id INT NOT NULL AUTO_INCREMENT,
                election_name VARCHAR(255) NOT NULL,
                election_administrator_email VARCHAR(45) NOT NULL,
                election_start DATETIME NULL,
                election_end DATETIME NULL,
                PRIMARY KEY (election_id)
            );`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
