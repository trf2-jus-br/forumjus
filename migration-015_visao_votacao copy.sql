DROP VIEW IF EXISTS votacao_detalhada;

CREATE VIEW votacao_detalhada AS 
	SELECT 
		*,
        ifnull(if(evento = 'VOTAÇÃO POR COMISSÃO', favor / quorum > 2/3, favor / quorum >= 2/3), 0) as aprovado
    FROM (
		SELECT 
			votacao.*, 
			committee_id, 
			evento, 
			(
				SELECT COUNT(*) 
				FROM presenca 
				JOIN membro ON membro.id = presenca.membro
				WHERE 
					( (saida IS NULL OR saida >= votacao.inicio) AND (entrada <= votacao.fim OR votacao.fim IS NULL) ) AND
					membro.comite = statement.committee_id 
			) as quorum,
			(SELECT sum(IF(voto.voto = 1, 1, 0)) FROM  voto WHERE votacao.id = voto.votacao) AS favor,
			(SELECT sum(IF(voto.voto = 0, 1, 0)) FROM  voto WHERE votacao.id = voto.votacao) AS contra,
			juncao,
			juncao.texto as juncao_texto,
			juncao.justificativa as juncao_justificativa
		FROM votacao
		JOIN statement ON statement.statement_id = votacao.enunciado
		LEFT JOIN juncao_enunciado ON juncao_enunciado.enunciado = statement_id
		LEFT JOIN juncao ON juncao.id = juncao_enunciado.juncao
		JOIN calendario ON votacao.inicio > calendario.inicio AND (votacao.fim < calendario.fim OR votacao.fim IS NULL)
    ) as T;