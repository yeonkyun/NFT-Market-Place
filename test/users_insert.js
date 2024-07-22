var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();

let id = 'id01';
let pw = 'pw01';
let name = '가나다';
let phn = '01012345678';
let values = [id,pw,name,phn];

conn.query(db_sql.users_insert, values, (err, result, fields) => {
    if(err){
        console.log('Insert Error');
        console.log('Error Message:')+err;
    }else{
        console.log('Insert OK !');
    }
    db_connect.close(conn);
});