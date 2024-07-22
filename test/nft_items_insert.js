var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();

let name = '마우스';
let digital_contents = 'http://example.com/art.jpg';
let price = '15000';
let values = [name,digital_contents,price];

conn.query(db_sql.nft_items_insert, values, (err, result, fields) => {
    if(err){
        console.log('Insert Error');
        console.log('Error Message:')+err;
    }else{
        console.log('Insert OK !');
    }
    db_connect.close(conn);
});