-- using postgres

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	user_name VARCHAR(100) NOT NULL,
	password_hash VARCHAR(100) NOT NULL,
	role VARCHAR(100) NOT NULL DEFAULT 'USER',
);

CREATE TABLE lists (
	list_id SERIAL PRIMARY KEY,
	owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	name VARCHAR(300) NOT NULL,
	is_archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE items (
	item_id SERIAL PRIMARY KEY,
	name VARCHAR(300) NOT NULL,
);

-- memberList
CREATE TABLE lists_users (
	list_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	PRIMARY KEY(list_id, user_id),
	FOREIGN KEY(list_id) REFERENCES lists(list_id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- itemList
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