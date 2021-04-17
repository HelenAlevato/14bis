create database bd14bis;

create schema tabela;

create table tabela.tbl_login(
	login_id bigserial,
	login_nome varchar(100),
	login_cpf varchar(50) unique,
	login_username varchar(70) unique,
	login_senha varchar(70),
	login_status bool,
	constraint pk_login primary key(login_id)
	);
	
create table tabela.tbl_manual(
	manual_id bigserial,
	manual_nome varchar(100),
	manual_url varchar(200),
	manual_date timestamptz ,
	constraint pk_manual primary key(manual_id)
	);
	
create table tabela.tbl_remark(
	remark_id bigserial,
	remark_traco varchar(30) unique,
	constraint pk_remark primary key(remark_id)
);

create table tabela.tbl_lep(
	lep_id bigserial,
	lep_url_full varchar(200),
	lep_url_delta varchar(200),
	lep_url_lep varchar(200),
	lep_code varchar(20),
	lep_traco int8,
	constraint pk_lep primary key(lep_id),
	constraint fk_lep foreign key (lep_traco) references tabela.tbl_remark(remark_id)
);

create table tabela.tbl_codelist(
	cod_id bigserial,
	cod_secao varchar(20),
	cod_subsecao varchar(20),
	cod_block varchar(20),
	cod_blockname varchar(50),
	cod_code varchar(20),
	cod_traco int8,
	cod_lep int8,
	constraint pk_codelist primary key(cod_id),
	constraint fk_cod_traco foreign key (cod_traco) references tabela.tbl_remark(remark_id),
	constraint fk_cod_lep foreign key (cod_lep) references tabela.tbl_lep(lep_id)
);

create table tabela.tbl_manual_codelist(
	mancod_id bigserial,
	manual_id int8,
	cod_id int8,
	constraint pk_manual_codelist primary key(mancod_id)
);