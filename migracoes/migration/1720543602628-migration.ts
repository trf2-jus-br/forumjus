import { MigrationInterface, QueryRunner } from "typeorm";
import { esquemaAtual } from "../esquemas";

export class Migration1720543602628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const esquema = await esquemaAtual(queryRunner);

        if(esquema !== "trfForumJus3")
            return;


        await queryRunner.query(`UPDATE trfForumJus3.configuracao SET valor = '/saia-3.png' WHERE nome = 'BANNER';`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
