const cjson = require("../config.json");
const mysql = require("mysql");
const moment = require("moment");

const debug_prefix = "\x1b[47m\x1b[30m" + cjson.messages.syntax.prefix.debug + "\x1b[0m ";
const log = message => { console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`); }

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB,
	connectionLimit: 10
});

pool.on("connection", function handleNewConnection(con) {
	let debug_status = cjson.bot.debug;
	if(debug_status === true) {
		log(debug_prefix + "DB: Connection established");
	}
	try {
		con.on("error", function(err) {
			if(err.code === "PROTOCOL_CONNECTION_LOST") {
				if(debug_status === true) {
					console.error('DB: Database connection was closed.');
				}
				setTimeout(handleNewConnection, 2000);
			} else if(err.code === 'ER_CON_COUNT_ERROR') {
				if(debug_status === true) {
					console.error('Database has too many connections.');
				}
				setTimeout(handleNewConnection, 2000);
			} else if (err.code === 'ECONNREFUSED') {
				if(debug_status === true) {
					console.error('Database connection was refused.');
				}
				setTimeout(handleNewConnection, 2000);
			} else {
				console.error(new Date(), "MySQL error", err.code);
			}
		});
		con.on("close", function(err) {
			if(err) {
				log("Connection closed failed.");
			} else {
				if(debug_status === true) {
					log(debug_prefix + "Connection closed normally.");
				}
			}
			console.error(new Date(), "MySQL close", err);
		});
	} catch(err) {
		console.error(new Date(), "MySQL extreme error", err.code);
	}
});

module.exports = pool;
