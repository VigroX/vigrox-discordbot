const Wolfram = require("node-wolfram");
const wa = new Wolfram(process.env.WOLFRAM_API_KEY);

var resultOpts = ["Result", "Exact result", "Decimal approximation"];

exports.run = async (client, message, args) => {
	if(client.cjson.modules.wolfram.enabled === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
    if(!args[0]) {
        return message.reply("Wrong usage! Example: (+wolfram 1+1)");
    }
    let question = args.join(" ");
    wa.query(args.join(" "), (err, result) => {
        if(err) {
            return message.reply(`Something went wrong!`);
        } else if(result.queryresult.pod != undefined) {
            for(var a=0; a < result.queryresult.pod.length; a++) {
                var pod = result.queryresult.pod[a];
                if(resultOpts.indexOf(pod.$.title) > -1) {
                    for(var b=0; b<pod.subpod.length; b++) {
                        var subpod = pod.subpod[b];
                        for(var c=0; c<subpod.plaintext.length; c++) {
                            var answer = subpod.plaintext[c];
                            answer = "**" + resultOpts[resultOpts.indexOf(pod.$.title)] + "**: " + subpod.plaintext[c];
                            if(resultOpts[resultOpts.indexOf(pod.$.title)] == 'Decimal approximation') {
                                answer = "**" + resultOpts[resultOpts.indexOf(pod.$.title)] + "**: " + "```";
                                answer += resultOpts[resultOpts.indexOf(pod.$.title)] == 'Decimal approximation' ? subpod.plaintext[c].substring(0, 7) + "```" : subpod.plaintext[c] + "```";
                            }
                        }
                    }
                }
            }
            if(answer != undefined) {
                let embed = new client.discord.RichEmbed()
                .setColor("#fdc818")
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .addField("**Question**", question)
                .addField("**Answer**", answer)
                .setTimestamp()
                .setFooter("Powered By Wolfram Alpha");
                return message.channel.send(embed);
            }
            return message.reply("I don't seem to have an answer to that question!");
        } else {
            return message.reply("I don't seem to have an answer to that question!");
        }
    });
};

exports.config = {
    name: "wolfram",
    aliases: ["wolframalpha", "wolfram", "calc", "wa", "math", "calculator"],
    usage: "wolfram <calculation>",
    description: "Search a calculation on Wolfram Alpha.",
    accessableby: "Members"
};
