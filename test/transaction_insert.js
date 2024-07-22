var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();

let date = '2024-07-22 15:30:00';
let seller_id = 'seller123';
let buyer_id = 'buyer456';
let trans_succ = 'TRUE'
let trans_fail = 'FALSE'
let item_id = 'item789'
let values = [date,seller_id,buyer_id,trans_succ,trans_fail,item_id];

conn.query(db_sql.transaction_insert, values, (err, result, fields) => {
    if(err){
        console.log('Insert Error');
        console.log('Error Message:')+err;
    }else{
        console.log('Insert OK !');
    }
    db_connect.close(conn);
});