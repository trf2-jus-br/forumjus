import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719847964653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE candidate (
            candidate_id INT NOT NULL AUTO_INCREMENT,
            election_id INT NOT NULL,
            candidate_name VARCHAR(255) NOT NULL,
            candidate_votes INT NOT NULL,
            PRIMARY KEY (candidate_id));`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
