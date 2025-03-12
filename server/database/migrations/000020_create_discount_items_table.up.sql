CREATE TABLE discount_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    discount_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (discount_id, product_id) 
);