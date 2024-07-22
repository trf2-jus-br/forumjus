import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721325874564 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE committee 
                DROP COLUMN committee_chair_document,
                DROP COLUMN committee_chair_name,

                ADD capa_proposta_recebida varchar(128),
                ADD capa_proposta_admitida varchar(128),
                ADD capa_proposta_comissao varchar(128),
                ADD capa_proposta_plenaria varchar(128),
                
                ADD CONSTRAINT fk_proposta_recebida FOREIGN KEY (capa_proposta_recebida) REFERENCES arquivo(id),
                ADD CONSTRAINT fk_proposta_admitida FOREIGN KEY (capa_proposta_admitida) REFERENCES arquivo(id),
                ADD CONSTRAINT fk_proposta_comissao FOREIGN KEY (capa_proposta_comissao) REFERENCES arquivo(id),
                ADD CONSTRAINT fk_proposta_plenaria FOREIGN KEY (capa_proposta_plenaria) REFERENCES arquivo(id);`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
