exports.run = async (client, message, args) => {
	if(client.cjson.modules.help === false) {
		return message.reply(":no_entry_sign: This module is disabled!");
	}
    if(args[0]) {
        let command = args[0];
        if(client.commands.has(command) || client.aliases.get(command)) {
            command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
            let embed = new client.discord.RichEmbed()
            .setColor("#FFFFFF")
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setDescription(`The bot prefix is: ${client.config.prefix}\n\n**Command:** ${command.config.name}\n**Description:** ${command.config.description || "No Description"}\n**Usage:** ${command.config.usage || "No Usage"}\n**Accessable by:** ${command.config.accessableby || "Default"}\n**Aliases:** ${command.config.aliases || "No Aliases"}`)
            .setFooter(client.user.username, client.user.displayAvatarURL)
            .setTimestamp();
            message.channel.send(embed);
        }
    }
    if(!args[0]) {
        message.delete();
        let embed = new client.discord.RichEmbed()
        .setColor("#FFFFFF")
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(`${message.author.username} check your dms!`);
        let Sembed = new client.discord.RichEmbed()
        .setColor("#FFFFFF")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setTimestamp()
        .setDescription(`These are the avaliable commands for the bot!\nThe bot prefix is: ${client.config.prefix}`)
        .addField(`Commands:`, client.cmdList)
        .setFooter(client.user.username, client.userdisplayAvatarURL)
        .setTimestamp();
        message.channel.send(embed).then(m => m.delete(10000));
        message.author.send(Sembed).then(m => m.delete(60000));
    }
};

exports.config = {
    name: "help",
    aliases: ["h", "commands", "cmds"],
    usage: "help",
    description: "Get a list of all the avaliable bot commands!",
    accessableby: "Members"
};
