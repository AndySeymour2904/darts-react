CREATE TABLE darts (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(255) NOT NULL,
    who VARCHAR(255) NOT NULL,
    value_name VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT NOW() NOT NULL
);
