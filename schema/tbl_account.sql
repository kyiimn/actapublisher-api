-- DROP TABLE t_account_dept;
CREATE TABLE t_account_dept (
    id bigint NOT NULL,
    media_id bigint NOT NULL,
    name character varying (24) NOT NULL,
    sort integer NOT NULL,
    invalid_flag integer NOT NULL,
    "group" integer NOT NULL,
    group_list bigint[],
    CONSTRAINT pk_account_dept_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_account_user;
CREATE TABLE t_account_user (
    id bigserial NOT NULL,
    media_id bigint NOT NULL,
    dept_id bigint NOT NULL,
    login_name character varying (128) NOT NULL,
    name character varying (128) NOT NULL,
    password character varying (128) NOT NULL,
    email character varying (128),
    byline character varying (128),
    use integer NOT NULL,
    level integer NOT NULL,
    rule integer NOT NULL,
    fixed integer NOT NULL,
    original_data jsonb,
    CONSTRAINT pk_account_user_id PRIMARY KEY (id),
    CONSTRAINT unique_account_user UNIQUE (login_name)
) WITH (OIDS = FALSE);

-- DROP TABLE t_account_preference;
CREATE TABLE t_account_preference (
    id bigserial NOT NULL,
    media_id bigint NOT NULL,
    frame_unit_type character varying(8) NOT NULL,
    text_unit_type character varying(8) NOT NULL,
    default_body_textstyle_id bigint NOT NUll,
    default_title_textstyle_id bigint NOT NULL,
    dpi integer NOT NULL,
    options jsonb NOT NULL,
    CONSTRAINT pk_account_preference_id PRIMARY KEY (id),
    CONSTRAINT unique_account_preference UNIQUE (media_id)
) WITH (OIDS = FALSE);
