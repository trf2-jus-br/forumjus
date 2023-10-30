ALTER TABLE statement ADD COLUMN codigo INT;

DROP TABLE voto, votacao;

CREATE TABLE votacao (
	id BIGINT NOT NULL AUTO_INCREMENT,
    enunciado INT NOT NULL,
    inicio DATETIME NOT NULL DEFAULT (NOW()),
    fim DATETIME,
    iniciada_por BIGINT NOT NULL,
    
    FOREIGN KEY(enunciado) REFERENCES statement(statement_id),
    FOREIGN KEY(iniciada_por) REFERENCES membro(id),
    
    PRIMARY KEY(id)
);

CREATE TABLE voto (
	id BIGINT NOT NULL AUTO_INCREMENT,
    votacao BIGINT NOT NULL,
    membro BIGINT NOT NULL,
    voto BIT NOT NULL,
    data DATETIME NOT NULL DEFAULT (NOW()),
    
    UNIQUE voto_unico (membro, votacao),
    
    FOREIGN KEY(votacao) REFERENCES votacao(id),
    FOREIGN KEY(membro) REFERENCES membro(id),
    
    PRIMARY KEY(id)
);

DROP TABLE voter;
DROP TABLE election;
DROP TABLE candidate;


CREATE TABLE calendario (
	id BIGINT NOT NULL AUTO_INCREMENT,
	evento VARCHAR(200) NOT NULL,
    inicio DATETIME NOT NULL,
    fim DATETIME NOT NULL,
    
    PRIMARY KEY (id)
);

INSERT INTO calendario (evento, inicio, fim) VALUES 
	( 'INSCRIÇÕES', '2023-10-09T18:07', '2023-11-09 18:07'),
	( 'HOMOLOGAÇÃO', '2023-10-09T18:07', '2023-11-09 18:07'),
	( 'VOTAÇÃO POR COMISSÃO', '2023-10-30 00:00:01', '2023-10-30 23:59:59'),
	( 'VOTAÇÃO GERAL', '2023-10-31 00:00:01', '2023-10-31 23:59:59');
