const mysql = require('mysql');
const pool = mysql.createPool(require('./db_config'));
//db_config.json 에 db설정파일을 만들어서 모듈화한다.
module.exports = pool;
