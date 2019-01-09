exports.run = async (client, message, args) => {
	message.reply(`Pong! ${Math.round(client.ping)}ms`);
};

exports.config = {
	name: "ping",
	aliases: ["pong", "ms", "connection"],
	usage: "ping",
	description: "Get the bot network delay in milliseconds.",
	accessableby: "Members"
};
