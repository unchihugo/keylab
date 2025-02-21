CREATE TABLE discounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'fixed') NOT NULL, 
    value DECIMAL(10, 2) NOT NULL CHECK (value > 0),
    start_date TIMESTAMP NOT NULL, 
    end_date TIMESTAMP NOT NULL, 
    applicable_items TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);