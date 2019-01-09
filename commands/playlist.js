exports.run = async (client, message, args) => {
	if(client.cjson.modules.playlist === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
	let embed = new client.discord.RichEmbed()
	.setColor("BLUE")
	.setTitle("Playlist (MANUAL)")
	.setDescription(`TIP: ${client.config.prefix}yt playlist`)
	.addField("1. YouTube URL", "!play " + process.env.YT_PL)
	.addField("2. Randomize Queue (optional)", "!shuffle")
	.addField("3. Repeat Playlist (optional)", "!loopqueue")
	.addField("4. Skip Current (optional)", "!skip")
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
