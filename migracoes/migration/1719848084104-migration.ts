import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848084104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO occupation VALUES(1, 1, 'Magistrado(a)');`);
        await queryRunner.query(`INSERT INTO occupation VALUES(2, 1, 'Procurador(a)');`);
        await queryRunner.query(`INSERT INTO occupation VALUES(3, 1, 'Integrante da Administração Pública');`);
        await queryRunner.query(`INSERT INTO occupation VALUES(4, 1, 'Advogado(a)');`);
        await queryRunner.query(`INSERT INTO occupation VALUES(5, 1, 'Acadêmico(a)');`);
        await queryRunner.query(`INSERT INTO occupation VALUES(6, 1, 'Outros');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
