import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719848306278 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE committee Add committee_description varchar(1024) not null;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto à importância de se prevenir e enfrentar todas as formas de assédio moral e sexual e a discriminação em todas as suas esferas de atuação. Abarca ainda questões relacionadas ao tratamento preconceituoso dirigido à comunidade LGBTQIAP+." where committee_id = 1;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto à aplicação do conceito de Justiça Restaurativa na prevenção e solução de conflitos, inclusive de natureza criminal. Abarca ainda debates sobre o sistema carcerário, política institucional de atenção e apoio às vítimas de crimes e atos infracionais, programa de assistência a vítimas e testemunhas ameaçadas e temas correlatos." where committee_id = 2;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto ao tema socioambiental nas áreas judicial e administrativa. Abarca ainda a questão da mediação de conflitos fundiários de natureza coletiva, rurais ou urbanos." where committee_id = 3;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto às ações de acessibilidade e inclusão, voltadas à eliminação de quaisquer formas de discriminação e à remoção de barreiras de todas as espécies, visando à maior integração da pessoa com deficiência. Abarca ainda a questão da promoção da igualdade racial, a eliminação do racismo, primando por valores de igualdade, equidade e respeito." where committee_id = 4;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto às questões e os desafios relacionados ao uso da tecnologia da informação e da internet, incluindo tópicos como privacidade, proteção de dados, processo digital, prova digital, propriedade intelectual, direitos autorais e temas correlatos." where committee_id = 5;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto à viabilização da entrega de serviços que possibilitem o exercício do direito ao acesso à Justiça e à cidadania a grupos vulneráveis, em especial a população de rua, excluídos social, econômica e geograficamente. Abarca também questões relativas ao combate à submissão a condição análoga de escravo e o tratamento dispensado aos povos originários." where committee_id = 6;`);
        await queryRunner.query(`UPDATE committee SET committee_description = "A temática objeto da comissão está voltada à discussão quanto aos problemas jurídicos e as alternativas possíveis para a solução das demandas relacionadas a políticas públicas de saúde." where committee_id = 7;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
