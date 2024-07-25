const queries = {
  // Users 테이블 쿼리
  createUser: `
    INSERT INTO users (id, pw, name, nickname, eth_addr, phn, createAt)
    VALUES (?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
  `,
  getUserById: `
    SELECT * FROM users WHERE id = ?
  `,
  getAllUser: `
    SELECT * FROM users
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
    VALUES (?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), 'admin')
  `,
  updateUserToAdmin: `
    UPDATE users SET type = 'admin' WHERE id = ?
  `,

  // NFT Item 테이블 쿼리
  createNftItem: `
    INSERT INTO nft_item (seller_id, name, contents, price, createAt)
    VALUES (?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
  `,
  getNftItemById: `
    SELECT * FROM nft_item WHERE id = ?
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
    VALUES (?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
  `,
  getAllTransaction: `
    SELECT * FROM trans
  `,
  getTransactionById: `
    SELECT * FROM trans WHERE id = ?
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
    SELECT t.*, ni.name as item_name, ni.price
    FROM trans t
    JOIN nft_item ni ON t.item_id = ni.id
    WHERE t.seller_id = ? OR t.buyer_id = ?
  `,
  getActiveNftItems: `
    SELECT ni.*, u.nickname as owner_nickname
    FROM nft_item ni
    LEFT JOIN trans t ON ni.id = t.item_id
    LEFT JOIN users u ON ni.seller_id = u.id
    WHERE t.status = true OR t.status IS NULL
    ORDER BY ni.createAt DESC
  `
};

module.exports = queries;