CREATE USER practicum WITH PASSWORD 'practicum';
CREATE DATABASE practicum OWNER practicum;
\c practicum practicum

CREATE TABLE films (
    id uuid PRIMARY KEY,
    rating double precision NOT NULL,
    director varchar NOT NULL,
    tags text[] NOT NULL,
    title varchar NOT NULL,
    about varchar NOT NULL,
    description varchar NOT NULL,
    image varchar NOT NULL,
    cover varchar NOT NULL
);

CREATE TABLE schedules (
    id uuid PRIMARY KEY,
    daytime varchar NOT NULL,
    hall varchar NOT NULL,
    rows int NOT NULL,
    seats int NOT NULL,
    price int NOT NULL,
    taken text[] NOT NULL DEFAULT '{}',
    "filmId" uuid NOT NULL REFERENCES films (id) ON DELETE CASCADE
);
