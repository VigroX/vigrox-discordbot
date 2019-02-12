exports.run = async (client, message, args) => {
	if(!client.cjson.modules.ping)
		return message.reply(":no_entry_sign: This module is disabled!");
	return message.reply(`Pong! ${Math.round(client.ping)}ms`);
};

exports.config = {
	name: "ping",
	aliases: ["pong", "ms", "connection"],
	usage: "ping",
	description: "Get the bot network delay in milliseconds.",
	accessableby: "Members"
};