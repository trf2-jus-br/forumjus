import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778696617730 implements MigrationInterface {

    // Correção do erro, ao acessar http://localhost:8081/inscricoes, com os outros perfis diferentes de Programador (corrigido no migration anterior), 
    // apresenta erro "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '?' at line 5" 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO perfil_recurso (id, perfil, recurso) VALUES 
            (2, 1, 1),
            (3, 2, 1),
            (4, 4, 1),
            (5, 5, 1);`
        );          
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
