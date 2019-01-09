exports.run = async (client, message, args) => {
	let embed = new client.discord.RichEmbed()
	.setColor("GREEN")
	.setAuthor(message.author.tag, message.author.displayAvatarURL)
	.setTitle("User Information")
	.setThumbnail(message.author.displayAvatarURL)
	.addField("Username", message.author.username, true)
	.addField("User ID", message.author.id, true)
	.addField("Joined", message.member.joinedAt)
	.setFooter(client.user.username, client.user.displayAvatarURL)
	.setTimestamp();
	return message.channel.send(embed);
};

exports.config = {
	name: "userinfo",
	aliases: ["ui", "infouser", "user", "aboutuser"],
	usage: "userinfo",
	description: "Get information about yourself.",
	accessableby: "Members"
};
