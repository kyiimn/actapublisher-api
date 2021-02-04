-- DROP TABLE t_config_media_def;
CREATE TABLE t_config_media_def (
    id bigint NOT NULL,
    name character varying(1024) NOT NULL,
    type character varying(8) NOT NULL,
    CONSTRAINT pk_config_media_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_code_def;
CREATE TABLE t_config_code_def (
    id bigserial NOT NULL,
    class integer NOT NULL,
    code character varying(8) NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint,
    sort integer,
    use integer NOT NULL,
    CONSTRAINT pk_config_code_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_local_def;
CREATE TABLE t_config_local_def (
    id bigserial NOT NULL,
    code character varying(2) NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint NOT NULL,
    sort integer NOT NULL,
    use integer NOT NULL,
    CONSTRAINT pk_config_local_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_local_def UNIQUE (code, media_id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_edition_def;
CREATE TABLE t_config_edition_def (
    id bigserial NOT NULL,
    edition integer NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint NOT NULL,
    use integer NOT NULL,
    CONSTRAINT pk_config_edition_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_edition_def UNIQUE (edition, media_id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_section_def;
CREATE TABLE t_config_section_def (
    id bigserial NOT NULL,
    code character varying(2) NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint NOT NULL,
    use integer NOT NULL,
    CONSTRAINT pk_config_section_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_section_def UNIQUE (code, media_id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_adver_size_def;
CREATE TABLE t_config_adver_size_def (
    id bigint NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint NOT NULL,
    use integer NOT NULL,
    CONSTRAINT pk_config_adver_size_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_adver_local_def;
CREATE TABLE t_config_adver_local_def (
    id bigserial NOT NULL,
    code character varying(2) NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint NOT NULL,
    sort integer NOT NULL,
    use integer NOT NULL,
    CONSTRAINT pk_config_adver_local_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_adver_local_def UNIQUE (code, media_id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_color_def;
CREATE TABLE t_config_color_def (
    id bigserial NOT NULL,
    name character varying(1024) NOT NULL,
    media_id bigint NOT NULL,
    color_type character varying(8) NOT NULL,
    code character varying(9) NOT NULL,
    sort integer NOT NULL,
    CONSTRAINT pk_config_color_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_color_def UNIQUE (name, media_id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_print_type_def;
CREATE TABLE t_config_print_type_def (
    id bigint NOT NULL,
    name character varying(1024) NOT NULL,
    CONSTRAINT pk_config_print_type_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_closing_time_def;
CREATE TABLE t_config_closing_time_def (
    id bigserial NOT NULL,
    closing_date character varying (8),
    closing_time character varying (6) NOT NULL,
    media_id bigint NOT NULL,
    page integer NOT NULL,
    edition_id bigint NOT NULL,
    CONSTRAINT pk_config_closing_time_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_storage_def;
CREATE TABLE t_config_storage_def (
    id bigint NOT NULL,
    name character varying (1024) NOT NULL,
    base_path character varying (256) NOT NULL,
    archive integer NOT NULL,
    CONSTRAINT pk_config_storage_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_page_size_def;
CREATE TABLE t_config_page_size_def (
    id bigserial NOT NULL,
    name character varying (1024) NOT NULL,
    paper_type character varying (8) NOT NULL,
    paper_width numeric NOT NULL,
    paper_height numeric NOT NULL,
    paper_direction character varying (8) NOT NULL,
    linespacing_size numeric NOT NULL,
    linespacing_unit character varying (8) NOT NULL,
    linespacing_ratio numeric NOT NULL,
    col_margin_inside numeric NOT NULL,
    col_margin_outside numeric NOT NULL,
    col_count integer NOT NULL,
    col_size numeric NOT NULL,
    col_spacing numeric NOT NULL,
    col_other numeric NOT NULL,
    col_total_size numeric NOT NULL,
    line_margin_top numeric NOT NULL,
    line_margin_bottom numeric NOT NULL,
    line_height numeric NOT NULL,
    line_count integer NOT NULL,
    line_spacing numeric NOT NULL,
    line_other numeric NOT NULL,
    line_total_size numeric NOT NULL,
    CONSTRAINT pk_config_page_size_def_id PRIMARY KEY (id)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_font_def;
CREATE TABLE t_config_font_def (
    id bigserial NOT NULL,
    media_id bigint NOT NULL,
    name character varying (64) NOT NULL,
    file_storage_id bigint NOT NULL,
    file_extension character varying (4) NOT NULL,
    file_size integer NOT NULL,
    sort integer NOT NULL,
    CONSTRAINT pk_config_font_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_font_def UNIQUE (media_id, name)
) WITH (OIDS = FALSE);

-- DROP TABLE t_config_textstyle_def;
CREATE TABLE t_config_textstyle_def (
    id bigserial NOT NULL,
    media_id bigint NOT NULL,
    name character varying (64) NOT NULL,
    sort integer NOT NULL,
    font_id bigint NOT NULL,
    font_size numeric NOT NULL,
    color_id bigint NOT NULL,
    xscale numeric NOT NULL,
    letter_spacing numeric NOT NULL,
    line_height numeric NOT NULL,
    text_align integer NOT NULL,
    underline integer NOT NULL,
    strikeline integer NOT NULL,
    indent numeric NOT NULL,
    CONSTRAINT pk_config_textstyle_def_id PRIMARY KEY (id),
    CONSTRAINT unique_config_textstyle_def UNIQUE (media_id, name)
) WITH (OIDS = FALSE);
