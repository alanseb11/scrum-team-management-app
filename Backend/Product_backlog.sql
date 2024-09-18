CREATE TABLE ProductBacklog (
    artist_code   NUMBER(4) NOT NULL,
    artist_gname  VARCHAR2(20),
    artist_fname  VARCHAR2(20),
    artist_street VARCHAR2(30) NOT NULL,
    artist_city   VARCHAR2(30) NOT NULL,
    artist_phone  CHAR(10),
    state_code    CHAR(3) NOT NULL
);