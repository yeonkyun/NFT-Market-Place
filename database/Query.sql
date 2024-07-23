CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    pw VARCHAR(20) NOT NULL,
    name VARCHAR(5) NOT NULL,
    nickname VARCHAR(8) NOT NULL,
    acc VARCHAR(42) NOT NULL,
    phn VARCHAR(11) NOT NULL,
    reg_date DATETIME NOT NULL,
    user_type ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE nft_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    contents VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    reg_date DATETIME NOT NULL
);

CREATE TABLE trans (
    date DATETIME PRIMARY KEY,
    seller_id VARCHAR(20),
    buyer_id VARCHAR(20),
    item_id INT,
    trans_status BOOLEAN,
    trans_date DATETIME,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES nft_item(id)
);