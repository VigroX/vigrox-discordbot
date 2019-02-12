exports.run = async (client, message, args) => {
	if(!client.cjson.modules.purge)
		return message.reply(":no_entry_sign: This module is disabled!");
	if(!message.member.hasPermission("MANAGE_MESSAGES"))
		return message.reply("You do not have permission!");
	if(!args[0] || args[0] <= 0)
		return usage();
	if(args[0].match(/^\d+$/)) {
		let deleteAmount = args[0];
		if(args[0] > 100) {
			message.channel.fetchMessages().then(messages => message.channel.bulkDelete(messages)).catch(err => {
				if(err.message === "You can only bulk delete messages that are under 14 days old.")
					return message.reply("You cannot delete messages that are under 14 days old.");
				client.log(err);
				return message.reply("Something went wrong, please report this issue!");
			});
		} else {
			message.channel.fetchMessages({ limit: deleteAmount }).then(messages => message.channel.bulkDelete(messages)).catch(err => {
				if(err.message === "You can only bulk delete messages that are under 14 days old.")
					return message.reply("You cannot delete messages that are under 14 days old.");
				client.log(err);
				return message.reply("Something went wrong, please report this issue!");
			});
		}
	} else {
		return usage();
	}
	function usage() {
		let embed = new client.discord.RichEmbed()
		.setDescription("Help Page: (PURGE)")
		.setColor("#15f153")
		.addField("USAGE:", client.config.prefix + "purge <amount>");
		return message.channel.send(embed);
	}
};

exports.config = {
	name: "purge",
	aliases: ["clear", "clearchat", "chatclear"],
	usage: "purge <number>",
	description: "Purge the chat messages.",
	accessableby: "Staff"
};