import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848606739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `create table log (
                id bigint not null auto_increment,
                acao varchar(126) not null,
                detalhes text not null,
                usuario varchar(1024) not null,
                data datetime default current_timestamp,
                
                primary key (id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
