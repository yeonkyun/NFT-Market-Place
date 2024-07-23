module.exports = {
    users_select:'SELECT * FROM users',
    users_select_one:'SELECT * FROM users WHERE id = ?',
    users_insert:'INSERT INTO users (id, pw, name, nickname, acc, phn, reg_date, user_type) VALUES (?, ?, ?, ?, ?, ?, SYSDATE(), ?);',
    users_update:'UPDATE users SET pw = ?, name = ?, nickname = ?, acc = ?, phn = ?, user_type = ? WHERE id = ?;',
    users_delete:'DELETE FROM users WHERE id = ?',
    nft_items_select:'SELECT * FROM nft_items',
    nft_items_select_one:'SELECT * FROM nft_items WHERE id = ?',
    nft_items_insert:'INSERT INTO nft_items VALUES (?,?,?,SYSDATE())',
    nft_items_update:'UPDATE nft_items SET name = ?, price = ?, digital_contents = ? WHERE id = ?',
    nft_items_delete:'DELETE FROM nft_items WHERE id = ?',
    trans_select:'SELECT * FROM trans',
    trans_select_one:'SELECT * FROM trans WHERE date = ?',
    trans_insert:'INSERT INTO trans (date, seller_id, buyer_id, item_id, trans_succ, trans_fail, trans_date) VALUES (?, ?, ?, ?, ?, ?, SYSDATE());',
    trans_update:'UPDATE trans seller_id = ?, buyer_id = ?, item_id = ?, trans_succ = ?, trans_fail = ?, trans_date = ? WHERE date = ?',
    trans_delete:'DELETE FROM trans WHERE date = ?'
}