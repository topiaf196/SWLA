var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'aa1r7najta1l02a.csmd5bqcvg3i.us-west-2.rds.amazonaws.com',
  user     : 'swla',
  password : 'wombat370',
  database : 'SISDB'
});

module.exports = connection;