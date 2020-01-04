
-- for testing

DROP TABLE IF EXISTS foo CASCADE;
CREATE TABLE foo (
  id            SERIAL PRIMARY KEY,
  label         VARCHAR(255)
);

DROP TABLE IF EXISTS foo2 CASCADE;
CREATE TABLE foo2 (
  id1           INT NOT NULL,
  id2           INT NOT NULL,
  label         VARCHAR(255),
  PRIMARY KEY (id1, id2)
);