import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848062762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE occupation (
            occupation_id INT NOT NULL AUTO_INCREMENT,
            forum_id INT NOT NULL,
            occupation_name VARCHAR(255) NOT NULL,
            PRIMARY KEY (occupation_id),
            FOREIGN KEY (forum_id) REFERENCES forum(forum_id));`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
