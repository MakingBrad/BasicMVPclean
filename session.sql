-- DDL generated by Postico 2.1.2
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE session (
    sid character varying PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX session_pkey ON session(sid text_ops);
CREATE INDEX "IDX_session_expire" ON session(expire timestamp_ops);
