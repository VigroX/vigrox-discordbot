const urban = require("urban");

exports.run = async (client, message, args) => {
	if(!client.cjson.modules.urban)
		return message.reply(":no_entry_sign: This module is disabled!");
	const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
	if(!args[0])
		return message.channel.send(":question: Invalid usage. (urban <word>)");
	let search = urban(args.join(" "));
	search.first(json => {
		if(!json) return message.channel.send("There were no results for " + `**${args.join(" ")}**` + ".");
		json.definition = json.definition.length > 2040 ? json.definition.slice(0, 2039) : json.definition
		json.example = json.example.length > 1020 ? json.example.slice(0, 1019) : json.example
		if(!args[0]) {
			let embed = new client.discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setTitle("ERROR")
			.setColor(randomColor)
			.setDescription("No word was found!")
			.setFooter("Powered By Urban Dictionary")
			.setTimestamp();
			return message.channel.send({embed : embed});
		}
		if(!json.definition) {
			let embed = new client.discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setTitle("`"+args.join(" ")+"`")
			.setColor(randomColor)
			.setDescription("No definition was found!")
			.setFooter("Powered By Urban Dictionary")
			.setTimestamp();
			return message.channel.send({embed : embed});
		}
		if(!json.example) {
			let embed = new client.discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setTitle("`"+args.join(" ")+"`")
			.setColor(randomColor)
			.setDescription(json.definition)
			.addField("**Example(s)**", "No examples were found!")
			.setFooter("Powered By Urban Dictionary")
			.setTimestamp();
			return message.channel.send({embed : embed});
		} else {
			let embed = new client.discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setTitle("`"+args.join(" ")+"`")
			.setColor(randomColor)
			.setDescription(json.definition)
			.addField("**Example(s)**", json.example)
			.setFooter("Powered By Urban Dictionary")
			.setTimestamp();
			return message.channel.send({embed : embed});
		}
	});
};

exports.config = {
	name: "urban",
	aliases: ["dictionary", "word", "definition"],
	usage: "urban <word>",
	description: "Search a definition of a word on Urban Dictionary.",
	accessableby: "Members"
};