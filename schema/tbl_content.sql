-- DROP TABLE t_adver;
CREATE TABLE t_adver (
    id bigint NOT NULL,
    ver integer NOT NULL,
    title character varying (1024) NOT NULL,
    description text,
    media_id bigint NOT NULL,
    dept_id bigint,
    user_id bigint,
    reg_date timestamp with time zone NOT NULL,
    pub_date character varying (8) NOT NULL,
    edition_id bigint NOT NULL,
    page integer NOT NULL,
    adver_size_id bigint NOT NULL,
    send_id character varying (128),
    send_date timestamp with time zone,
    send_user character varying (128),
    source character varying (8),
    copyright character varying (8),
    fixed_type integer NOT NULL,
    adver_type character varying (8) NOT NULL,
    status character varying (8) NOT NULL,
    file_storage_id bigint NOT NULL,
    file_extension character varying (4) NOT NULL,
    file_size integer NOT NULL,
    color_id bigint NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    resolution integer NOT NULL,
    lock integer NOT NULL,
    lock_date timestamp with time zone,
    lock_user_id bigint,
    CONSTRAINT pk_adver_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_article;
CREATE TABLE t_article (
    id bigint NOT NULL,
    ver integer NOT NULL,
    title character varying (1024) NOT NULL,
    body text NOT NULL,
    body_type character varying (8) NOT NULL,
    article_type character varying (8) NOT NULL,
    status character varying (8) NOT NULL,
    media_id bigint NOT NULL,
    dept_id bigint,
    user_id bigint,
    reg_date timestamp with time zone NOT NULL,
    pub_date character varying (8) NOT NULL,
    edition_id bigint NOT NULL,
    page integer NOT NULL,
    send_id character varying (128),
    send_date timestamp with time zone,
    send_user character varying (128),
    source character varying (8),
    copyright character varying (8),
    modify_date timestamp with time zone,
    modify_user_id bigint,
    byline text,
    lock integer NOT NULL,
    lock_date timestamp with time zone,
    lock_user_id bigint,
    CONSTRAINT pk_article_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_image;
CREATE TABLE t_image (
    id bigint NOT NULL,
    ver integer NOT NULL,
    title character varying (1024) NOT NULL,
    description text,
    media_id bigint NOT NULL,
    dept_id bigint,
    user_id bigint,
    reg_date timestamp with time zone NOT NULL,
    pub_date character varying (8) NOT NULL,
    edition_id bigint NOT NULL,
    page integer NOT NULL,
    send_id character varying (128),
    send_date timestamp with time zone,
    send_user character varying (128),
    source character varying (8),
    copyright character varying (8),
    fixed_type integer NOT NULL,
    image_type character varying (8) NOT NULL,
    status character varying (8) NOT NULL,
    file_storage_id bigint NOT NULL,
    file_extension character varying (4) NOT NULL,
    file_size integer NOT NULL,
    color_id bigint NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    resolution integer NOT NULL,
    lock integer NOT NULL,
    lock_date timestamp with time zone,
    lock_user_id bigint,
    CONSTRAINT pk_image_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);