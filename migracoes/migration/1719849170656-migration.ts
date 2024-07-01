import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719849170656 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE operador (
                matricula varchar(10),
                comite int not null,
                
                primary key(matricula),
                foreign key(comite) references committee(committee_id)
            );`
        );        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
