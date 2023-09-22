
/*drop table permissao;*/

create table permissao(
	id bigint not null auto_increment,
	nome varchar(100) not null,
    usuarios text not null,
    comissoes text not null,
    crud bool default false,
    primary key (id)
);

alter table statement drop statement_acceptance_datetime;
alter table statement drop statement_rejection_datetime;

alter table statement add statement_acceptance int not null default 0;
alter table statement add statement_rejection int not null default 0;

