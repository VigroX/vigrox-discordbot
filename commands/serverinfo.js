exports.run = async (client, message, args) => {
	if(!client.cjson.modules.serverinfo)
		return message.reply(":no_entry_sign: This module is disabled!");
	if(!message.member.hasPermission("BAN_MEMBERS"))
		return message.reply(":no_entry_sign: You do not have permission!");
	function checkBots(guild) {
		let botCount = 0;
		guild.members.forEach(member => {
			if(member.user.bot)
				botCount++;
		});
		return botCount;
	}
	function checkMembers(guild) {
		let memberCount = 0;
		guild.members.forEach(member => {
			if(!member.user.bot)
				memberCount++;
		});
		return memberCount;
	}
	let embed = new client.discord.RichEmbed()
	.setAuthor(`${message.guild.name} - Server Infomation`, message.guild.iconURL)
	.setColor("GREEN")
	.setThumbnail(message.guild.iconURL)
	.addField("Server owner", message.guild.owner, true)
	.addField("Server region", message.guild.region, true)
	.addField("Channel count", message.guild.channels.size, true)
	.addField("Total member count", message.guild.memberCount, true)
	.addField("Users", checkMembers(message.guild), true)
	.addField("Bots", checkBots(message.guild), true)
	.addField("Verification level", message.guild.verificationLevel, true)
	.setFooter("Server created at:")
	.setTimestamp(message.guild.createdAt);
	return message.channel.send(embed);
};

exports.config = {
	name: "serverinfo",
	aliases: ["si", "serverdesc", "aboutserver"],
	usage: "serverinfo",
	description: "Get information about the discord server.",
	accessableby: "Staff"
};