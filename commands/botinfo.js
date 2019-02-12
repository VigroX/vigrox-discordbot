exports.run = async (client, message, args) => {
	if(!client.cjson.modules.botinfo)
		return message.reply(":no_entry_sign: This module is disabled!");
	let embed = new client.discord.RichEmbed()
	.setColor("#15f153")
	.setTitle("Bot Information")
	.setThumbnail(client.user.displayAvatarURL, true)
	.addField("Bot Name", client.user.username, true)
	.addField("Version", client.config.version, true)
	.addField("Prefix", client.config.prefix, true)
	.addField("Ping", `${Math.round(client.ping)}ms`, true)
	.addField("Created On", client.user.createdAt)
	.setTimestamp()
	.setFooter(`${client.user.username}`, `${client.user.avatarURL}`);
	return message.channel.send(embed);
};

exports.config = {
	name: "botinfo",
	aliases: ["bi", "infobot", "bot", "aboutbot"],
	usage: "botinfo",
	description: "Get information about the bot.",
	accessableby: "Members"
};