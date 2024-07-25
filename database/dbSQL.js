const queries = {
    // Users 테이블 쿼리
    createUser: `
      INSERT INTO users (id, pw, name, nickname, acc, phn, reg_date)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `,
    getUserById: `
      SELECT * FROM users WHERE id = ?
    `,
    updateUser: `
      UPDATE users
      SET pw = ?, name = ?, nickname = ?, acc = ?, phn = ?
      WHERE id = ?
    `,
    deleteUser: `
      DELETE FROM users WHERE id = ?
    `,
    createAdminUser: `
    INSERT INTO users (id, pw, name, nickname, acc, phn, reg_date, user_type)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), 'admin')
  `,

    // NFT Item 테이블 쿼리
    createNftItem: `
      INSERT INTO nft_item (id, name, contents, price, reg_date)
      VALUES (0, ?, ?, ?, NOW())
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
      INSERT INTO trans (date, seller_id, buyer_id, item_id, trans_status, trans_date)
      VALUES (NOW(), ?, ?, ?, ?, ?)
    `,
    getTransactionByDate: `
      SELECT * FROM trans WHERE date = ?
    `,
    updateTransaction: `
      UPDATE trans
      SET seller_id = ?, buyer_id = ?, item_id = ?, trans_status = ?, trans_date = ?
      WHERE date = ?
    `,
    deleteTransaction: `
      DELETE FROM trans WHERE date = ?
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
      LEFT JOIN users u ON t.buyer_id = u.id
      WHERE t.trans_status = true OR t.trans_status IS NULL
      ORDER BY ni.reg_date DESC
    `
};

module.exports = queries;