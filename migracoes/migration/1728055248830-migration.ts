import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728055248830 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO funcao_perfil (funcao, perfil) VALUES 
                ("PRESIDENTA", 1),
                ("PRESIDENTE", 1),
                ("RELATOR", 1),
                ("RELATORA", 1),
                
                ("PROGRAMADOR", 3),
                ("ASSESSORIA", 2),
                
                ("COORDENAÇÃO CIENTÍFICA", 4),
                ("COORDENAÇÃO EXECUTIVA", 4),
                ("COORDENADOR GERAL", 4),
                
                ("JURISTA", 5),
                ("ESPECIALISTA", 5);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
