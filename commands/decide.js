exports.run = async (client, message, args) => {
	if(client.cjson.modules.decide === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
	if(!args[1]) return message.reply("There must be atleast two words to decide from!");
	let arguments = args.join(", ");
	let wordArray = args.join(" ").split(" ");
	let result = wordArray[Math.floor(Math.random() * wordArray.length)];
	let embed = new client.discord.RichEmbed()
	.setAuthor(message.author.tag)
	.setColor("BLUE")
	.addField("Decided from:", arguments)
	.addField("Result", result);
	message.channel.send(embed);
};

exports.config = {
	name: "decide",
	aliases: ["de", "choose", "or"],
	usage: "decide <word> <word> [word]...",
	description: "Let the bot decide your decision.",
	accessableby: "Members"
};
