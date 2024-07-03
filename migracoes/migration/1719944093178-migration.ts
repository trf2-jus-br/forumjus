import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719944093178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE configuracao ADD valor varchar(2048);`)
        await queryRunner.query(
            `INSERT INTO configuracao (id, nome, valor) 
                VALUES 
                    (1, 'NOME', 'II Jornada de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região'),
                    (2, 'BANNER', '/saia-2.png'),
                    (3, 'JWT_SALT', 'ZkPzHenEaKqqNvu');`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.query(`ALTER TABLE configuracao DROP COLUMN valor;`)
        //await queryRunner.query(`DELETE FROM configuracao WHERE id IN (1, 2, 3);`)
    }
}
