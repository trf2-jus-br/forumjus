import { MigrationInterface, QueryRunner } from "typeorm";
import { esquemaAtual } from "../esquemas";

export class Migration1720543153731 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const esquema = await esquemaAtual(queryRunner);

        if(esquema !== "trfForumJus2")
            return;


        await queryRunner.query(`UPDATE trfForumJus2.configuracao SET valor = '/saia-2.jpg' WHERE nome = 'BANNER';`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
