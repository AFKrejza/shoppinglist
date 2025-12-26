-- this file contains the schemas, sample data, and queries

-- using postgres

-- schema

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	user_name VARCHAR(100) NOT NULL,
	password_hash VARCHAR(100) NOT NULL,
	role VARCHAR(100) NOT NULL DEFAULT 'USER'
);

-- shoppingLists collection was renamed to lists
CREATE TABLE lists (
	list_id SERIAL PRIMARY KEY,
	owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	name VARCHAR(300) NOT NULL,
	is_archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE items (
	item_id SERIAL PRIMARY KEY,
	name VARCHAR(300) NOT NULL
);

CREATE TABLE lists_users (
	list_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	PRIMARY KEY(list_id, user_id),
	FOREIGN KEY(list_id) REFERENCES lists(list_id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE lists_items (
	quantity BIGINT DEFAULT 1 NOT NULL,
	unit VARCHAR(300) DEFAULT '' NOT NULL,
	ticked BOOLEAN DEFAULT FALSE NOT NULL,
	list_id INTEGER NOT NULL,
	item_id INTEGER NOT NULL,
	PRIMARY KEY(list_id, item_id),
	FOREIGN KEY (list_id) REFERENCES lists(list_id) ON DELETE CASCADE,
	FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

CREATE INDEX idx_lists_users_user_id ON lists_users(user_id);
CREATE INDEX idx_lists_items_item_id ON lists_items(item_id);



-- sample data

-- this sample data is based on ./server/config/seed.js
INSERT INTO users (email, user_name, password_hash, role) VALUES
(
	'admin@admin.com',
	'superadmin',
	'$2b$10$JCjYk9pIj5an2zaHgPL9B.BfK.RwZk10tf72gc0Jto9eJuU7hUgMK',
	'SUPERADMIN'
),
(
	'john@gmail.com',
	'john',
	'$2b$10$tDekcIchpsguhjcBA74BNuBDmJv5smOKpsd1I7d7rMKLueByfvNWi',
	'USER'
),
(
	'sam@gmail.com',
	'sam',
	'$2b$10$tDekcIchpsguhjcBA74BNuBDmJv5smOKpsd1I7d7rMKLueByfvNWi',
	'USER'
);

INSERT INTO lists (owner_id, name) VALUES
(1, 'Groceries'),
(2, 'Clothes');

INSERT INTO items (name) VALUES
('Milk'),
('Beer'),
('Propane'),
('Gloves'),
('Ski mask');

-- note: this only works on a totally new db with serials. Normally I'd do it differently.
INSERT INTO lists_users (list_id, user_id) VALUES
(1, 1),
(2, 2);

INSERT INTO lists_items(list_id, item_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5);



-- queries

-- show unticked items
SELECT * FROM lists_items WHERE list_id=1;