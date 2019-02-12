const sa = require("superagent");

exports.run = async (client, message, args) => {
	if(!client.cjson.modules.dog)
		return message.reply(":no_entry_sign: This module is disabled!");
	let {body} = await sa.get('https://random.dog/woof.json');
	checkUrl(body.url.slice(-3).toLowerCase());
	function checkUrl(url) {
		let formats = "jpg,gif,png,peg";
		if(formats.indexOf(url) !== -1) {
			let embed = new client.discord.RichEmbed()
			.setColor("BLUE")
			.setTitle(":dog: Bark...")
			.setImage(body.url);
			return message.channel.send(embed);
		}
		let embed = new client.discord.RichEmbed()
		.setColor("RED")
		.setTitle(":dog: Noouuu...")
		.addField("Broouken!", "Unlucky")
		.setFooter("Try Again later...");
		return message.channel.send(embed);
	}
};

exports.config = {
	name: "dog",
	aliases: ["dogpic", "randomdog", "poppy"],
	usage: "dog",
	description: "Get random picture of a dog.",
	accessableby: "Members"
};