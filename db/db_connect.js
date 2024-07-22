const mysql = require('mysql2');
const config = require('./db_config');

module.exports = {
  getConnection:function(){
    return mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    });
  },
  close:function(conn){
    console.log('Close..');
    conn.end();
  }

}


/*
module.exports = function () {
  var config = require('./db_config');    // ./는 현재 디렉토리를 나타냅니다
  var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

  return {
    getConnection: function (callback) {    // connection pool을 생성하여 리턴합니다
      pool.getConnection(callback);
    },
    end: function(callback){
      pool.end(callback);
    }
  }
}();
*/