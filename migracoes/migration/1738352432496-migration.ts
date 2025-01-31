import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738352432496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE Teste1 (
                id int not null auto_increment,
                perfil int not null,
                recurso int not null,
                
                foreign key (perfil) references perfil (id),
                foreign key (recurso) references recurso (id),
                primary key (id)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
