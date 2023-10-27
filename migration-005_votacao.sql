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