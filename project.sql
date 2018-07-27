create table user(
	id varchar(20) primary key,
    password varchar(20) not null,
    name varchar(20) not null,
    regdate date not null
);

insert into user values('quacia', '1111', '이하나', curdate());
commit;

select * from user;

create table bbs(
	id int(10) primary key auto_increment,
    title varchar(255) not null,
    content text not null,
    u_id varchar(20),
    regdate date not null,
    foreign key(u_id) references user(id)
);

insert into bbs(title, content, u_id, regdate) values('테스트', '테스트', 'quacia', curdate());