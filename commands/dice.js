const d20 = require("d20");

exports.run = async (client, message, args) => {
	if(client.cjson.modules.dice === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
	if(!args[0]) {
		return message.channel.send(`:question: Invalid usage: (example: ${client.config.prefix}dice d20)`);
	}
	if(args[0].split("d").length <= 1) {
		if(d20.roll(args[0]) === 0) {
			return message.channel.send(`:question: Invalid usage: (example: ${client.config.prefix}dice d20)`);
		} else {
			message.channel.send(message.author + " rolled a " + d20.roll(args[0] || "10"));
		}
	} else if(args[0].split("d").length > 1) {
		var eachDie = args[0].split("+");
		var passing = 0;
		for (var i = 0; i < eachDie.length; i++){
			if (eachDie[i].split("d")[0] < 50) {
				passing += 1;
			};
		}
		if(passing == eachDie.length) {
			if(d20.roll(args[0]) === 0) {
				return message.channel.send(`:question: Invalid usage: (example: ${client.config.prefix}dice d20)`);
			} else {
				message.channel.send(message.author + " rolled a " + d20.roll(args[0]));
			}
		} else {
			message.channel.send(message.author + " tried to roll too many dice at once!");
		}
	} else {
		return message.channel.send(`:question: Invalid usage: (example: ${client.config.prefix}dice d20)`);
	}
}

exports.config = {
	name: "dice",
	aliases: ["d", "roll"],
	usage: "dice <number>",
	description: "Roll a die.",
	accessableby: "Members"
};
