import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848278203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE statement (
            statement_id INT NOT NULL AUTO_INCREMENT,
            forum_id INT NOT NULL,
            attendee_id INT NOT NULL,
            committee_id INT NOT NULL,
            statement_text VARCHAR(1024) NOT NULL,
            statement_justification VARCHAR(2048) NOT NULL,
            statement_acceptance_datetime DATETIME NULL,
            statement_rejection_datetime DATETIME NULL,
            PRIMARY KEY (statement_id),
            FOREIGN KEY (forum_id) REFERENCES forum(forum_id),
            FOREIGN KEY (attendee_id) REFERENCES attendee(attendee_id),
            FOREIGN KEY (committee_id) REFERENCES committee(committee_id));`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
