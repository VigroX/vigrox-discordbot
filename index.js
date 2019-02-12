const fs = require('fs');

process.on('unhandledRejection', (e) => {
	console.error(e);
	process.exit(1);
});

try {
	var Discord = require("discord.js");
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!");
	process.exit();
}
console.log("Starting DiscordBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);

const client = new Discord.Client({disableEveryone: true});
const moment = require("moment");

client.db = require("./utils/mysql.js");
client.discord = require("discord.js");

client.commands = new client.discord.Collection();
client.aliases = new client.discord.Collection();

client.cjson = require("./config.json");
client.package = require("./package.json");

client.log = message => { console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`); }

// LANG
client.debug_prefix = "\x1b[47m\x1b[30m" + client.cjson.messages.syntax.prefix.debug + "\x1b[0m ";
client.cmd_prefix = "\x1b[32m" + client.cjson.messages.syntax.prefix.cmd + "\x1b[0m ";
client.db_prefix = "\x1b[36m" + client.cjson.messages.syntax.prefix.db + "\x1b[0m ";
client.bot_prefix = "\x1b[35m" + client.cjson.messages.syntax.prefix.bot + "\x1b[0m ";

client.msg_success = " \x1b[32m" + client.cjson.messages.syntax.type.ok + "\x1b[0m";
client.msg_error = " \x1b[31m" + client.cjson.messages.syntax.type.error + "\x1b[0m";
client.msg_load = " \x1b[36m" + client.cjson.messages.syntax.type.load + "\x1b[0m";
client.msg_warn = " \x1b[33m" + client.cjson.messages.syntax.type.warn + "\x1b[0m";

// VARIABLES
let config;
let modules;

let config_values = [
	['activity', client.cjson.bot.activity],
	['version', client.package.version],
	['prefix', client.cjson.bot.prefix]
];

let modules_values = [
	['eightball', client.cjson.modules.eightball],
	['botinfo', client.cjson.modules.botinfo],
	['cat', client.cjson.modules.cat],
	['coinflip', client.cjson.modules.coinflip],
	['dice', client.cjson.modules.dice],
	['dog', client.cjson.modules.dog],
	['help', client.cjson.modules.help],
	['mysql', client.cjson.modules.mysql],
	['ping', client.cjson.modules.ping],
	['playlist', client.cjson.modules.playlist],
	['purge', client.cjson.modules.purge],
	['serverinfo', client.cjson.modules.serverinfo],
	['urban', client.cjson.modules.urban],
	['userinfo', client.cjson.modules.userinfo],
	['wolfram', client.cjson.modules.wolfram],
	['yt', client.cjson.modules.yt]
];

let mysql_status = client.cjson.bot.mysql;
let debug_status = client.cjson.bot.debug;

let dirCommandsLoaded;
let dirEventsLoaded;

const load = async () => {
	// START
	function mainStart() {
		main((mysql_result, start) => {
			if(!start) {
				client.log(client.bot_prefix + "There was an issue starting the bot." + client.msg_error);
				return mainReset();
			}
			if(debug_status)
				client.log(client.debug_prefix + "DB: MySQL (" + mysql_result + ")");
			return startBot();
		});
	}

	function mainReset() {
		setTimeout(() => {
			client.destroy();
			return mainStart();
		}, 10000);
	}
	
	// MAIN
	function main(callback, status) {
		client.log(client.bot_prefix + "Starting bot..." + client.msg_load);
		loadDir(() => {});
		if(!mysql_status)
			return callback(false, true);
		client.log(client.db_prefix + "Connecting to database..." + client.msg_load);
		connectMySQL((response) => {
			if(!response) {
				if(debug_status)
					client.log(client.debug_prefix + "DB: MySQL" + client.msg_error);
				return callback(response, false);
			}
			if(debug_status)
				client.log(client.debug_prefix + "DB: connectMySQL" + client.msg_success);
			client.log(client.db_prefix + `Loading database: config` + client.msg_load);
			writeMySQL("config", () => {
				client.log(client.db_prefix + `Loaded database: config` + client.msg_success);
				client.log(client.db_prefix + `Loading database: modules` + client.msg_load);
				writeMySQL("modules", () => {
					if(debug_status)
						client.log(client.debug_prefix + "DB: loadMySQL" + client.msg_success);
					client.log(client.db_prefix + `Loaded database: modules`+ client.msg_success);
					client.log(client.db_prefix + "Loaded all data from database!" + client.msg_success);
					return callback(response, true);
				});
			});
		});
	}

	// DIR
	function dirCommands(callback) {
		if(dirCommandsLoaded) {
			client.log(client.cmd_prefix + `Loaded commands from cache.` + client.msg_success);
			return callback();
		}
		fs.readdir("./commands/", (err, files) => {
			if(err)
				client.log(err);
			let jsfile = files.filter(f => f.split(".").pop() === "js");
			if(jsfile.length <= 0) return client.log(client.cmd_prefix + "Couldn't find any commands!" + client.msg_warn);
			client.log(client.cmd_prefix + `Loading ${files.length} commands...` + client.msg_load);
			client.cmdList = "";
			jsfile.forEach((f, i) => {
				let props = require(`./commands/${f}`);
				try {
					client.commands.set(props.config.name, props);
					props.config.aliases.forEach(alias => {
						client.aliases.set(alias, props.config.name);
					});
					dirCommandsLoaded = true;
					if(debug_status)
						client.log(client.debug_prefix + `${i +1}: ${f} loaded!` + client.msg_success);
					client.cmdList += "``" + props.config.name + "`` ";
				} catch(err) {
					if(debug_status)
						client.log(client.debug_prefix + `${i +1}: ${f} load!` + client.msg_error);
					return;
				}
			});
			client.log(client.cmd_prefix + `Loaded ${files.length} commands.` + client.msg_success);
			return callback();
		});
	}

	function dirEvents(callback) {
		if(dirEventsLoaded) {
			client.log(client.cmd_prefix + `Loaded events from cache.` + client.msg_success);
			return callback();
		}
		fs.readdir("./events/", (err, files) => {
			if(err)
				client.log(err);
			let jsfile = files.filter(f => f.split(".").pop() === "js");
			if(jsfile.length <= 0) return client.log(client.cmd_prefix + "Couldn't find any events!" + client.msg_warn);
			client.log(client.cmd_prefix + `Loading ${files.length} events...` + client.msg_load);
			jsfile.forEach((f, i) => {
				let props = require(`./events/${f}`);
				try {
					const evtName = f.split(".")[0];
					const event = require(`./events/${f}`);
					client.on(evtName, event.bind(null, client));
					delete require.cache[require.resolve(`./events/${f}`)];
					dirEventsLoaded = true;
					if(debug_status)
						client.log(client.debug_prefix + `${i +1}: ${f} loaded!` + client.msg_success);
				} catch(err) {
					if(debug_status)
						client.log(client.debug_prefix + `${i +1}: ${f} load!` + client.msg_error);
					return;
				}
			});
			client.log(client.cmd_prefix + `Loaded ${files.length} events.` + client.msg_success);
			return callback();
		});
	}

	function loadDir(callback) {
		dirCommands(() => {
			if(debug_status)
				client.log(client.debug_prefix + "DIR: Commands" + client.msg_success);
		});
		dirEvents(() => {
			if(debug_status)
				client.log(client.debug_prefix + "DIR: Events" + client.msg_success);
		});
		return callback();
	}

	// MySQL
	function writeMySQL(table, callback) {
		if(typeof table !== "undefined") {
			query(`SELECT * FROM ${table}`, (err) => {
				if(err) {
					execute(`CREATE TABLE IF NOT EXISTS ${table} (name varchar(30) PRIMARY KEY, value varchar(4096) NOT NULL);`, () => {
						if(table === "config")
							execute(`INSERT INTO ${table} (name, value) VALUES ?`, [config_values]);
						if(table === "modules")
							execute(`INSERT INTO ${table} (name, value) VALUES ?`, [modules_values]);
						client.log(client.db_prefix + `${table} has been created.`);
						checkMySQL(table, () => {
							return callback();
						});
					});
				}
				checkMySQL(table, () => {
					return callback();
				});
			});
		}
	}

	function connectMySQL(callback) {
		client.db.getConnection((err, con) => {
			if(!err) {
				con.release();
				client.log(client.db_prefix + "Connected to database!" + client.msg_success);
				return callback(true);
			}
			client.log(client.db_prefix + "Couldn't connect to database!" + client.msg_error);
			if(typeof err.sqlMessage !== "undefined")
				client.log(client.db_prefix + err.sqlMessage);
			client.log(client.db_prefix + "MySQL connection problem!" + client.msg_error);
			return callback(false);
		});
		if(debug_status)
			client.log(client.debug_prefix + "DB: MySQL" + client.msg_load);
	}

	async function checkMySQL(table, callback) {
		function checkList(callback) {
			function dbVersion(callback) {
				try {
					if(!client.config.version || client.config.version !== client.package.version) {
						if(debug_status)
							client.log(client.debug_prefix + "DB: checkMySQL (VERSION=" + client.package.version + ")");
						execute("UPDATE config SET value = ? WHERE name = 'version'", client.package.version);
						return callback();
					} else {
						return callback();
					}
				} catch(err) {
					client.log(client.db_prefix + "Loading config (dbVersion)" + client.msg_error);
					return callback();
				}
			}
			function dbPrefix(callback) {
				if(!client.config.prefix) {
					if(debug_status)
						client.log(client.debug_prefix + "DB: checkMySQL (PREFIX=" + client.cjson.bot.prefix + ")");
					execute("UPDATE config SET value = ? WHERE name = 'prefix'", client.cjson.bot.prefix);
					return callback();
				} else {
					return callback();
				}
			}
			function dbActivity(callback) {
				if(!client.config.activity) {
					if(debug_status)
						client.log(client.debug_prefix + "DB: checkMySQL (ACTIVITY=" + client.cjson.bot.activity + ")");
					execute("UPDATE config SET value = ? WHERE name = 'activity'", client.cjson.bot.activity);
					return callback();
				} else {
					return callback();
				}
			}
			dbVersion(() => {
				dbPrefix(() => {
					dbActivity(() => {
						return callback();
					});
				});
			});
		}
		if(typeof table !== "undefined") {
			loadMySQL(table, () => {
				checkList(() => {
					loadMySQL(table, () => {
						return callback();
					});
				});
			});
		}
	}

	function loadMySQL(table, callback) {
		function dbConfig(table, callback) {
			query(`SELECT name, value from ${table}`, (err, result) => {
				if(err) 
					return mainReset();
				try {
					client.config = {};
					result.forEach((row) => {
						client.config[row.name] = row.value;
					});
					return callback();
				} catch(e) {
					client.log(client.db_prefix + "Loading config" + client.msg_error);
					client.log(e);
					return mainReset();
				}
			});
		}
		function dbModules(table, callback) {
			query(`SELECT name, value from ${table}`, (err, result) => {
				if(err)
					return mainReset();
				try {
					client.modules = {};
					result.forEach((row) => {
						client.modules[row.name] = row.value;
					});
					return callback();
				} catch(e) {
					client.log(client.db_prefix + "Loading modules" + client.msg_error);
					return mainReset();
				}
			});
		}
		if(typeof table !== "undefined") {
			if(table === "config") {
				dbConfig(table, () => {
					if(debug_status)
						client.log(client.debug_prefix + "DB: loadMySQL (" + table + ")");
					return callback();
				});
			}
			if(table === "modules") {
				dbModules(table, () => {
					if(debug_status)
						client.log(client.debug_prefix + "DB: loadMySQL (" + table + ")");
					return callback();
				});
			}
		}
	}

	function resetMySQL(table) {
		execute(`DROP TABLE IF EXISTS ${table}`, () => {
			writeMySQL(table, () => {
				if(debug_status)
					client.log(client.debug_prefix + "DB: resetMySQL (" + table + ")");
			});
		});
	}

	client.setProperty = function setProperty(table, name, value, callback) {
		execute(`UPDATE ${table} SET value = ? WHERE name = ?`, [value, name], () => {
			writeMySQL(table, () => {
				checkMySQL(table, () => {
					if(debug_status)
						client.log(client.debug_prefix + "DB: setProperty (" + table + ")");
					return callback();
				});
			});
		});
	}

	async function execute(sql, params, callback) {
		client.db.query(sql, params, callback);
	}

	async function query(sql, callback) {
		client.db.query(sql, callback);
	}

	// BOT
	function startBot() {
		try {
			client.login(process.env.BOT_TOKEN);
		} catch(e) {
			client.log(client.bot_prefix + "Could not find or wrong bot token!" + client.msg_error);
		}
	}
	
	// RUN
	mainStart();
};

// LOAD
load();