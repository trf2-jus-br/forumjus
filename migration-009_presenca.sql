CREATE TABLE presenca (
id INT NOT NULL AUTO_INCREMENT,
membro BIGINT NOT NULL,
entrada DATETIME DEFAULT NOW(),
saida DATETIME,
dia ENUM('1ª VOTAÇÃO', '2ª VOTAÇÃO'),

PRIMARY KEY(id),
FOREIGN KEY(membro) REFERENCES membro(id),
CONSTRAINT membro_dia UNIQUE(membro, dia)
);