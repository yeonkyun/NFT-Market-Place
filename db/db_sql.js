module.exports = {
    users_select:'SELECT * FROM users',
    users_select_one:'SELECT * FROM users WHERE id = ?',
    users_insert:'INSERT INTO users (id, pw, name, phn, reg_date) VALUES (?, ?, ?, ?, SYSDATE())',
    users_update:'UPDATE users SET pw=?, name=? , phn =? WHERE id=?',
    users_delete:'DELETE FROM users WHERE id = ?',
    nft_items_select:'SELECT * FROM nft_items',
    nft_items_select_one:'SELECT * FROM nft_items WHERE id = ?',
    nft_items_insert:'INSERT INTO nft_items VALUES (?,?,?,SYSDATE())',
    nft_items_update:'UPDATE nft_items SET name = ?, price = ?, digital_contents = ? WHERE id = ?',
    nft_items_delete:'DELETE FROM nft_items WHERE id = ?',
    transaction_select:'SELECT * FROM transaction',
    transaction_select_one:'SELECT * FROM transaction WHERE date = ?',
    transaction_insert:'INSERT INTO transaction (date, seller_id, buyer_id, item_id, trans_succ, trans_fail, trans_date) VALUES (?, ?, ?, ?, ?, ?, SYSDATE());',
    transaction_update:'UPDATE transaction seller_id = ?, buyer_id = ?, item_id = ?, trans_succ = ?, trans_fail = ?, trans_date = ? WHERE date = ?',
    transaction_delete:'DELETE FROM transaction WHERE date = ?'
}