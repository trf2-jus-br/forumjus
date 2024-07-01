import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848021552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO forum VALUES(1, 'I Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
