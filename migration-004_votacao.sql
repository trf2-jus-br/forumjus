/*drop table permissao;*/

create table permissao(
	id bigint not null auto_increment,
	nome varchar(100) not null,
    usuarios text not null,
    administrar_comissoes text not null,
    votar_comissoes text not null,
    crud bool default false,
    estatistica bool default false,
    primary key (id)
);

alter table statement drop statement_acceptance_datetime;
alter table statement drop statement_rejection_datetime;

alter table statement add data_analise datetime;
alter table statement add analisado_por varchar(255);
alter table statement add admitido int default null;

