import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1727992190021 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE recurso (
                id int not null auto_increment,
                nome varchar(255) not null unique,
                descricao varchar(255),
                
                primary key (id)
            );`
        );

        await queryRunner.query(
            `CREATE TABLE perfil (
                id int not null auto_increment,
                nome varchar(255) not null unique,
                descricao varchar(255),
                
                primary key(id)
            );`
        );

        await queryRunner.query(
            `CREATE TABLE funcao_perfil (
                id int not null auto_increment,
                funcao varchar(255) not null,
                perfil int not null,
                
                foreign key fk_perfil(perfil) references perfil(id),
                primary key (id)
            );` 
        );

        await queryRunner.query(
            `INSERT INTO perfil (id, nome) VALUES 
                (1, 'presidente'), 
                (2, 'assessoria'), 
                (3, 'programador'),
                (4, 'coordenador'),
                (5, 'jurista');`
        );

        await queryRunner.query(`INSERT INTO recurso (nome, descricao) VALUES ('pages/inscricoes#exibirTodas', 'Na tela de inscrições, irá exibir as inscrições de todas as comissões.');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
