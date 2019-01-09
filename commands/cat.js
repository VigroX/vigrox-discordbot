const sa = require("superagent");

exports.run = async (client, message, args) => {
	let {body} = await sa.get('https://aws.random.cat/meow');
	let embed = new client.discord.RichEmbed()
	.setColor("BLUE")
	.setTitle(":cat: Meowww..")
	.setImage(body.file);
	return message.channel.send(embed);
};

exports.config = {
	name: "cat",
	aliases: ["catpic", "randomcat", "kitten"],
	usage: "cat",
	description: "Get random picture of a cat.",
	accessableby: "Members"
};
