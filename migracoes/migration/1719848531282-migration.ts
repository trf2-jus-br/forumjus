import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848531282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `create table membro (
                id bigint not null auto_increment,
                nome varchar(255) not null, 
                funcao varchar(255) not null,
                comite int not null,
                token varchar(36),
                proponente int,
                
                foreign key(proponente) references attendee(attendee_id),
                foreign key(comite) references committee(committee_id),
                unique token_unico (token),
                primary key(id)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
