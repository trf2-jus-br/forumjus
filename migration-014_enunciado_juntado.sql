CREATE TABLE juncao (
    id INT NOT NULL AUTO_INCREMENT,
    codigo INT NOT NULL,
    comite INT NOT NULL,
    texto VARCHAR(1024) NOT NULL,
    justificativa VARCHAR(2048) NOT NULL,

    FOREIGN KEY (comite) REFERENCES committee (committee_id),
    PRIMARY KEY (id)
);


CREATE TABLE juncao_enunciado (
    enunciado INT NOT NULL,
    juncao INT NOT NULL,

    PRIMARY KEY (enunciado, juncao),
    FOREIGN KEY (enunciado) REFERENCES statement (statement_id),
    FOREIGN KEY (juncao) REFERENCES juncao (id)
);