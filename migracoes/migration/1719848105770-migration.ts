import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848105770 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE committee (
            committee_id INT NOT NULL AUTO_INCREMENT,
            forum_id INT NOT NULL,
            committee_name VARCHAR(255) NOT NULL,
            committee_chair_name VARCHAR(255) NOT NULL,
            committee_chair_document VARCHAR(255) NOT NULL,
            PRIMARY KEY (committee_id),
            FOREIGN KEY (forum_id) REFERENCES forum(forum_id));`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
