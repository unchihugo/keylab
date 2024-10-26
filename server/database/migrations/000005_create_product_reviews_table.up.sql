CREATE TABLE product_reviews(
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    user_id BIGINT,
    rating SMALLINT NOT NULL CHECK(rating BETWEEN 0 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product
      FOREIGN KEY(product_id) REFERENCES products(product_id),

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) REFERENCES users(id)
    
);