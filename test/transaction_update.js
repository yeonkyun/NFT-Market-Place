var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();

let date = '2024-07-27 15:30:00';
let seller_id = 'seller321';
let buyer_id = 'buyer654';
let trans_succ = 'FALSE'
let trans_fail = 'TRUE'
let item_id = 'item987'
let values = [date,seller_id,buyer_id,trans_succ,trans_fail,item_id];

conn.query(db_sql.transaction_update, values, (err, result, fields) => {
    if(err){
        console.log('Update Error');
        console.log('Error Message:')+err;
    }else{
        console.log('Update OK !');
    }
    db_connect.close(conn);
});