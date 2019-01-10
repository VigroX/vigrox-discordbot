exports.run = async (client, message, args) => {
	if(client.cjson.modules.mysql === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
	if(!message.member.hasPermission("BAN_MEMBERS")) {
		return message.reply(":no_entry_sign: You do not have permission!");
	}
	if(client.cjson.bot.mysql !== true) {
		return message.reply(":no_entry_sign: This module is configured incorrectly!");
	}
	client.setProperty("config", "version", client.package.version, () => {
		message.reply("Updated Version to " + client.package.version);
	});
};

exports.config = {
	name: "mysql",
	aliases: ["sql", "db", "database"],
	usage: "mysql",
	description: "Configure the MySQL database.",
	accessableby: "Staff"
};
