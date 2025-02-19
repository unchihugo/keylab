ALTER TABLE product_categories
DROP COLUMN parent_id,
DROP CONSTRAINT fk_parent_category;