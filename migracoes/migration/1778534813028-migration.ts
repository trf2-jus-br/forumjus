import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778534813028 implements MigrationInterface {

    // Correção do erro, ao acessar http://localhost:8081/inscricoes, como Programador, 
    // apresenta erro "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '?' at line 5"
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO perfil_recurso (id, perfil, recurso) VALUES 
            (1, 3, 1);`
        );        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
