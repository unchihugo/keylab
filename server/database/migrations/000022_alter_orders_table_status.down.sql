ALTER TABLE orders
MODIFY COLUMN status ENUM('pending','shipped','delivered','cancelled') NOT NULL;