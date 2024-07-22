var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();

let id = 'id01';
let pw = 'pw02';
let name = '마바사';
let phn = '01087654321';
let values = [pw,name,phn,id];

conn.query(db_sql.users_update, values, (err, result, fields) => {
    if(err){
        console.log('Update Error');
        console.log('Error Message:')+err;
    }else{
        console.log('Update OK !');
    }
    db_connect.close(conn);
});