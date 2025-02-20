import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739206898781 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Cria uma tabela no banco, para que o SGBD garanta a integridade referencial do voto.
        await queryRunner.query(
            `CREATE TABLE tipo_voto (
                id INT NOT NULL,
                descricao VARCHAR(30) NOT NULL,
                PRIMARY KEY (id)
            );`
        );

        // Define os votos possíveis
        await queryRunner.query(
            `INSERT INTO tipo_voto VALUES 
            (0, 'Contrário'),
            (1, 'Favorável'),
            (2, 'Abstenção Explícita');`
        );
        
        // Altera o domínio da voto
        await queryRunner.query(`ALTER TABLE voto MODIFY voto INT NOT NULL;`);

        // Cria a referência
        await queryRunner.query(`ALTER TABLE voto ADD CONSTRAINT fk_voto_tipo_voto FOREIGN KEY (voto) REFERENCES tipo_voto(id);`);

        /* 
            - Corrige e generaliza o quorum,
            - Incluí a 'abstenção explícita'
        */
        await queryRunner.query(
            `CREATE OR REPLACE VIEW votacao_detalhada AS
                SELECT 
                    *,
                    ifnull(favor / quorum > quorum_minimo, 0) as aprovado
                FROM (
                    SELECT 
                        votacao.*, 
                        committee_id, 
                        evento,
                        configuracao.valor as quorum_minimo,
                        (
                            SELECT COUNT( DISTINCT membro.id) 
                            FROM presenca 
                            JOIN membro ON membro.id = presenca.membro
                            WHERE 
                                ( (saida IS NULL OR saida >= votacao.inicio) AND (entrada <= votacao.fim OR votacao.fim IS NULL) ) AND
                                (membro.comite = statement.committee_id OR evento = 'VOTAÇÃO GERAL')
                        ) as quorum,
                        (SELECT IFNULL(sum(IF(voto.voto = 1, 1, 0)),0) FROM  voto WHERE votacao.id = voto.votacao) AS favor,
                        (SELECT IFNULL(sum(IF(voto.voto = 0, 1, 0)), 0) FROM  voto WHERE votacao.id = voto.votacao) AS contra,
                        (SELECT IFNULL(sum(IF(voto.voto = 2, 1, 0)), 0) FROM  voto WHERE votacao.id = voto.votacao) AS abstencao_explicita,
                        juncao,
                        juncao.texto as juncao_texto,
                        juncao.justificativa as juncao_justificativa
                    FROM votacao
                    JOIN statement ON statement.statement_id = votacao.enunciado
                    LEFT JOIN juncao_enunciado ON juncao_enunciado.enunciado = statement_id
                    LEFT JOIN juncao ON juncao.id = juncao_enunciado.juncao
                    JOIN calendario ON votacao.inicio > calendario.inicio AND votacao.inicio < calendario.fim
                    LEFT JOIN configuracao ON configuracao.nome = IF(evento = 'VOTAÇÃO POR COMISSÃO', 'QUORUM_APROVACAO_COMISSAO', 'QUORUM_APROVACAO_PLENARIA')
                ) as T;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
