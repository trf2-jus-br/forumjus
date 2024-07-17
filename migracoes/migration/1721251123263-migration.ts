import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721251123263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( 
            `INSERT INTO configuracao (id, nome, valor) VALUES 
                (15, 'REGULAMENTO_CAPITULOS_DESTACADOS', 'Capítulos V e VI'),
                (16, 'TELEFONE_ORGANIZACAO', '(21) 2282-8374');`
            );
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
