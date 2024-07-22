var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();

let id = '1';
let name = '키보드';
let digital_contents = 'http://example.com/new_art.jpg';
let price = '20000'
let values = [name,digital_contents,price,id];

conn.query(db_sql.nft_items_update, values, (err, result, fields) => {
    if(err){
        console.log('Update Error');
        console.log('Error Message:')+err;
    }else{
        console.log('Update OK !');
    }
    db_connect.close(conn);
});