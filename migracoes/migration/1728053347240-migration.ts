import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728053347240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE perfil_recurso (
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
