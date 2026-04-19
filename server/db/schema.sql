-- First CREATE TABLE statements for users, categories, and tasks --
CREATE TABLE users (
	id INT PRIMARY KEY,
	email VARCHAR(255) UNIQUE,
	password_hash VARCHAR(255) UNIQUE,
	created_at DATE
);

CREATE TABLE categories (
	id INT PRIMARY KEY,
	user_id INT REFERENCES users(id),
	name VARCHAR(100) NOT NULL,
	color VARCHAR(50)
);

CREATE TABLE tasks (
	id INT PRIMARY KEY,
	user_id INT REFERENCES users(id),
	category_id INT REFERENCES categories(id),
	title TEXT NOT NULL,
	description TEXT,
	priority SMALLINT DEFAULT 3 CHECK (priority >= 1 AND priority <= 4),
	due_date TIMESTAMPTZ,
	is_complete BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ
);

SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM tasks;

