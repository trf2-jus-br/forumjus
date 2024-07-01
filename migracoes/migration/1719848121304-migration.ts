import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848121304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO committee VALUES(1, 1, 'Combate ao assédio e à discriminação', 'Chair 1', '111.111.111-11');`);
        await queryRunner.query(`INSERT INTO committee VALUES(2, 1, 'Justiça Restaurativa e direitos humanos das vítimas e pessoas encarceradas', 'Chair 2', '111.111.111-11');`);
        await queryRunner.query(`INSERT INTO committee VALUES(3, 1, 'Proteção contra o despejo forçado nos conflitos fundiários', 'Chair 3', '111.111.111-11');`);
        await queryRunner.query(`INSERT INTO committee VALUES(4, 1, 'Acessibilidade, Inclusão e Equidade', 'Chair 3', '111.111.111-11');`);
        await queryRunner.query(`INSERT INTO committee VALUES(5, 1, 'Direito digital, acesso à informação e proteção de dados', 'Chair 3', '111.111.111-11');`);
        await queryRunner.query(`INSERT INTO committee VALUES(6, 1, 'Justiça Itinerante e proteção de vulneráveis', 'Chair 3', '111.111.111-11');`);
        await queryRunner.query(`INSERT INTO committee VALUES(7, 1, 'Direito à Saúde', 'Chair 3', '111.111.111-11');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
