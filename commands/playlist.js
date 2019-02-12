exports.run = async (client, message, args) => {
	if(!client.cjson.modules.playlist)
		return message.reply(":no_entry_sign: This module is disabled!");
	if(!message.member.hasPermission("BAN_MEMBERS"))
		return message.reply(":no_entry_sign: You do not have permission!");
	try {
		var YT_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST;
	} catch(err) {
		return message.reply(":no_entry_sign: This module can't find the playlist!");
	}
	let embed = new client.discord.RichEmbed()
	.setColor("BLUE")
	.setTitle("Playlist [INFO]")
	.setDescription(`TIP: ${client.config.prefix}yt playlist`)
	.addField("1. YouTube URL", `${client.config.prefix}play https://www.youtube.com/playlist?list=` + YT_PLAYLIST_ID)
	.addField("2. Randomize Queue (optional)", `${client.config.prefix}yt shuffle`)
	.addField("3. Repeat Playlist (optional)", `${client.config.prefix}yt loop`)
	.addField("4. Skip Current (optional)", `${client.config.prefix}yt skip`)
	.setTimestamp()
	.setFooter(`${client.user.username}`, `${client.user.avatarURL}`);
	return message.channel.send(embed);
};

exports.config = {
	name: "playlist",
	aliases: ["pl"],
	usage: "ping",
	description: "Configure the default playlist.",
	accessableby: "Staff"
};