ALTER TABLE users
ADD COLUMN role_id BIGINT NOT NULL AFTER phone_number;
ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;
