DROP VIEW IF EXISTS votacao_detalhada;

CREATE VIEW votacao_detalhada AS 
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
        (SELECT sum(IF(voto.voto = 0, 1, 0)) FROM  voto WHERE votacao.id = voto.votacao) AS contra
	FROM votacao
    JOIN statement ON statement.statement_id = votacao.enunciado
	JOIN calendario ON votacao.inicio > calendario.inicio AND (votacao.fim < calendario.fim OR votacao.fim IS NULL);