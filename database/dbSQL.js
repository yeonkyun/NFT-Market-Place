const queries = {
  // Users 테이블 쿼리
  createUser: `
    INSERT INTO users (id, pw, name, nickname, eth_addr, phn, createAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `,
  getUserById: `
    SELECT id, pw, name, nickname, eth_addr, phn, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM users WHERE id = ?
  `,
  getAllUser: `
    SELECT id, pw, name, nickname, eth_addr, phn, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM users
  `,
  updateUser: `
    UPDATE users
    SET pw = ?, name = ?, nickname = ?, eth_addr = ?, phn = ?
    WHERE id = ?
  `,
  deleteUser: `
    DELETE FROM users WHERE id = ?
  `,
  createAdminUser: `
    INSERT INTO users (id, pw, name, nickname, eth_addr, phn, createAt, type)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), 'admin')
  `,
  updateUserToAdmin: `
    UPDATE users SET type = 'admin' WHERE id = ?
  `,

  // NFT Item 테이블 쿼리
  createNftItem: `
    INSERT INTO nft_item (seller_id, name, contents, price, createAt)
    VALUES (?, ?, ?, ?, NOW())
  `,
  getNftItemById: `
    SELECT id, seller_id, name, contents, price, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM nft_item WHERE id = ?
  `,
  getAllNftItem: `
    SELECT id, seller_id, name, contents, price, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM nft_item
  `,
  updateNftItem: `
    UPDATE nft_item
    SET name = ?, contents = ?, price = ?
    WHERE id = ?
  `,
  deleteNftItem: `
    DELETE FROM nft_item WHERE id = ?
  `,

  // Transaction 테이블 쿼리
  createTransaction: `
    INSERT INTO trans (seller_id, buyer_id, item_id, status, createAt)
    VALUES (?, ?, ?, ?, NOW())
  `,
  getAllTransaction: `
    SELECT id, seller_id, buyer_id, item_id, status, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM trans
  `,
  getTransactionById: `
    SELECT id, seller_id, buyer_id, item_id, status, DATE_FORMAT(createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM trans WHERE id = ?
  `,
  updateTransaction: `
    UPDATE trans
    SET seller_id = ?, buyer_id = ?, item_id = ?, status = ?
    WHERE id = ?
  `,
  deleteTransaction: `
    DELETE FROM trans WHERE id = ?
  `,

  // 추가적인 복잡한 쿼리
  getUserTransactions: `
    SELECT t.*, ni.name as item_name, ni.price, DATE_FORMAT(t.createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM trans t
    JOIN nft_item ni ON t.item_id = ni.id
    WHERE t.seller_id = ? OR t.buyer_id = ?
  `,
  getActiveNftItems: `
    SELECT ni.*, u.nickname as owner_nickname, DATE_FORMAT(ni.createAt, '%Y-%m-%d %H:%i:%s') as createAt
    FROM nft_item ni
    LEFT JOIN trans t ON ni.id = t.item_id
    LEFT JOIN users u ON ni.seller_id = u.id
    WHERE t.status = true OR t.status IS NULL
    ORDER BY ni.createAt DESC
  `,
  getTransChart: `
    SELECT 
        DATE_FORMAT(DATE(MIN(createAt)), '%Y-%m-%d') as date,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as success_count,
        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as fail_count
    FROM 
        trans
    WHERE 
        createAt >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
    GROUP BY 
        DATE(createAt)
    ORDER BY 
        DATE(createAt);
  `
};

module.exports = queries;