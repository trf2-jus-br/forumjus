import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848235019 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE attendee (
                attendee_id INT NOT NULL AUTO_INCREMENT,
                forum_id INT NOT NULL,
                occupation_id INT NOT NULL,
                committee_id INT NULL,
                attendee_name VARCHAR(255) NOT NULL,
                attendee_chosen_name VARCHAR(255) NULL,
                attendee_email VARCHAR(255) NOT NULL,
                attendee_phone VARCHAR(32) NOT NULL,
                attendee_document VARCHAR(255) NOT NULL,
                attendee_affiliation VARCHAR(255) NULL,
                attendee_disability VARCHAR(255) NULL,
                attendee_acceptance_datetime DATETIME NULL,
                attendee_rejection_datetime DATETIME NULL,
                PRIMARY KEY (attendee_id),
                FOREIGN KEY (forum_id) REFERENCES forum(forum_id),
                FOREIGN KEY (occupation_id) REFERENCES occupation(occupation_id),
                FOREIGN KEY (committee_id) REFERENCES committee(committee_id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
