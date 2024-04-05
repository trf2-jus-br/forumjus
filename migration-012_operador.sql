CREATE TABLE operador (
	matricula varchar(10),
    comite int not null,
    
    primary key(matricula),
    foreign key(comite) references committee(committee_id)
)