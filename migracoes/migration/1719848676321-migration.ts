import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848676321 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO membro (nome, funcao, comite, token) VALUES 
                ('Presidente 1', 'PRESIDENTE', 1, '294985f'),
                ('Presidente 2', 'PRESIDENTE', 2, '75cf409'),
                ('Presidente 3', 'PRESIDENTE', 3, 'bb2abf3'),
                ('Presidente 4', 'PRESIDENTE', 4, '22619b1e'),
                ('Presidente 5', 'PRESIDENTE', 5, 'bk2abz1'),
                ('Presidente 6', 'PRESIDENTE', 6, 'a4c7830'),
                ('Presidente 7', 'PRESIDENTE', 7, '42530e5'),
                ('Relator 1', 'RELATOR', 1, '6852767'),
                ('Relator 2', 'RELATOR', 2, 'a679039'),
                ('Relator 3', 'RELATOR', 3, 'd47ddd0'),
                ('Relator 4', 'RELATOR', 4, 'fb5c479'),
                ('Relator 5', 'RELATOR', 5, '28854ad'),
                ('Relator 6', 'RELATOR', 6, '9cd4a74'),
                ('Relator 7', 'RELATOR', 7, 'c46dfda')
            ;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
