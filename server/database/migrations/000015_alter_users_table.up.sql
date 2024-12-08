ALTER TABLE users
ADD role_id BIGINT AFTER phone_number,
ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id);
