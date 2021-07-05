create schema system;

create table system.level (
    code text primary key,
    description text
);

create table system.module (
    code text,
    level text,
    description text,
    minimum_age integer,
    price integer,
    primary key (code, level)
);

create table system.classroom (
    code text,
    level text,
    module text,
    capacity integer,
    start_date timestamp,
    end_date timestamp,
    primary key (code, level, module)
);

create table system.student (
    cpf text primary key,
    name text,
    birth_date timestamp
);

create table system.enrollment (
    code text primary key,
    sequence integer,
    level text,
    module text,
    classroom text,
    student text,
    installments integer,
    issue_date timestamp,
    status text
);

create table system.invoice (
    enrollment text,
    month integer,
    year integer,
    due_date timestamp,
    amount numeric,
    primary key(enrollment, month, year)
);

create table system.invoice_event (
    enrollment text,
    month integer,
    year integer,
    type text,
    amount numeric
);

insert into system.level (code, description) values ('EF1', 'Ensino Fundamental I'), ('EF2', 'Ensino Fundamental II'), ('EM', 'Ensino Médio');
insert into system.module (level, code, description, minimum_age, price) values ('EF1', '1', '1o Ano', 6, 15000), ('EF1', '2', '2o Ano', 7, 15000), ('EF1', '3', '3o Ano', 8, 15000), ('EF1', '4', '4o Ano', 9, 15000), ('EF1', '5', '5o Ano', 10, 15000), ('EF2', '6', '6o Ano', 11, 14000), ('EF2', '7', '7o Ano', 12, 14000), ('EF2', '8', '8o Ano', 13, 14000), ('EF2', '9', '9o Ano', 14, 14000), ('EM', '1',  '1o Ano',  15, 17000), ('EM', '2',  '2o Ano',  16, 17000), ('EM', '3',  '3o Ano',  17, 17000);
insert into system.classroom (level, module, code, capacity, start_date, end_date) values ('EM', '3', 'A', 2, '2021-06-01','2021-12-15'), ('EM', '3', 'B', 2, '2021-05-01','2021-05-30'), ('EM', '3', 'C', 2, '2021-05-01','2021-07-30'), ('EM', '3', 'F', 10, '2021-06-01','2021-12-15');
