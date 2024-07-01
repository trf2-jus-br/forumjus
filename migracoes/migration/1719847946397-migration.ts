import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719847946397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE voter (
                voter_id INT NOT NULL AUTO_INCREMENT,
                election_id INT NOT NULL,
                voter_name VARCHAR(255) NOT NULL,
                voter_email VARCHAR(255) NOT NULL,
                voter_vote_datetime DATETIME NULL,
                voter_vote_ip VARCHAR(45) NULL,
                PRIMARY KEY (voter_id));`
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
