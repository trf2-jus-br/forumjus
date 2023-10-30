/*COMANDO 1*/
alter table statement drop statement_acceptance_datetime;

/*COMANDO 2*/
alter table statement drop statement_rejection_datetime;

/*COMANDO 3*/
alter table statement add data_analise datetime;

/*COMANDO 4*/
alter table statement add admitido int default null;

/*COMANDO 5*/
create table membro (
	id bigint not null auto_increment,
	nome varchar(255) not null, 
    funcao varchar(255) not null,
    comite int not null,
    token varchar(36),
	proponente int,
    
    foreign key(proponente) references attendee(attendee_id),
	foreign key(comite) references committee(committee_id),
    unique token_unico (token),
    primary key(id)
);

/*COMANDO 6*/
create table log (
	id bigint not null auto_increment,
	acao varchar(126) not null,
    detalhes text not null,
    usuario varchar(1024) not null,
	data datetime default current_timestamp,
    
    primary key (id)
);

/*COMANDO 7*/
ALTER TABLE attendee DROP FOREIGN KEY attendee_ibfk_3;

/*COMANDO 8*/
ALTER TABLE attendee DROP COLUMN committee_id;

INSERT INTO membro (nome, funcao, comite, token) VALUES 
	('Presidente 1', 'PRESIDENTE', 1, '294985f'),
    ('Presidente 2', 'PRESIDENTE', 2, '75cf409'),
    ('Presidente 3', 'PRESIDENTE', 3, 'bb2abf3'),
    ('Presidente 4', 'PRESIDENTE', 4, '22619b1e'),
    ('Presidente 5', 'PRESIDENTE', 5, 'bk2abz1'),
    ('Presidente 6', 'PRESIDENTE', 6, 'a4c7830'),
    ('Presidente 7', 'PRESIDENTE', 7, '42530e5'),
    ('Relator 1', 'RELATOR', 1, '6852767'),
    ('Relator 2', 'RELATOR', 2, 'a679039'),
    ('Relator 3', 'RELATOR', 3, 'd47ddd0'),
    ('Relator 4', 'RELATOR', 4, 'fb5c479'),
    ('Relator 5', 'RELATOR', 5, '28854ad'),
    ('Relator 6', 'RELATOR', 6, '9cd4a74'),
    ('Relator 7', 'RELATOR', 7, 'c46dfda')
;