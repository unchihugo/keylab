ALTER TABLE product_categories
ADD COLUMN parent_id BIGINT NULL AFTER id,
ADD CONSTRAINT fk_parent_category FOREIGN KEY (parent_id) REFERENCES product_categories (id) ON DELETE SET NULL;