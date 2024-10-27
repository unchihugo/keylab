CREATE TABLE orders(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    order_date DATETIME NOT NULL,
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    shipping_address BIGINT NOT NULL,
    billing_address BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);