require('dotenv/config');

const db = process.env.NODE_ENV_AMBIENTE.trim();

var mysql = require('mysql2-promise')();

mysql.configure({
	"host": "localhost",
	"user": "root",
	"password": "",
	"database": db == "dev" ? "mylist_test" : "my_list",
	waitForConnections: true,
	connectionLimit: 100,
	queueLimit: 0
});


module.exports = function() {
	return mysql;
}	