import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848902558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE calendario (
                id BIGINT NOT NULL AUTO_INCREMENT,
                evento VARCHAR(200) NOT NULL,
                inicio DATETIME NOT NULL,
                fim DATETIME NOT NULL,
                
                PRIMARY KEY (id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
