exports.run = async (client, message, args) => {
	if(!client.cjson.modules.eightball)
		return message.reply(":no_entry_sign: This module is disabled!");
	if(!args[1]) return message.reply("Please ask a full question!");
	let replies = [
		"Yes.",
		"No.",
		"I don't know.",
		"Ask again later.",
		"Probably.",
		"Probably not.",
		"Maybe.",
		"Most likely.",
		"Yes definetely.",
		"It is certain.",
	];
	let result = Math.floor((Math.random() * replies.length));
	let question = args.join(" ");
	let embed = new client.discord.RichEmbed()
	.setAuthor(message.author.tag)
	.setColor("BLUE")
	.addField("Question", question)
	.addField("Answer", replies[result]);
	return message.channel.send(embed);
};

exports.config = {
	name: "8ball",
	aliases: ["question"],
	usage: "8ball",
	description: "Get the answer for a question.",
	accessableby: "Members"
};