CREATE TABLE presenca (
	id INT NOT NULL AUTO_INCREMENT,
    membro BIGINT NOT NULL,
	entrada DATETIME DEFAULT NOW(),
    saida DATETIME,
    
    PRIMARY KEY(id),
    FOREIGN KEY(membro) REFERENCES membro(id)
);