module.exports = async (client, message) => {
    if(!message.guild || message.author.bot) return;
    if(!message.content.startsWith(client.config.prefix)) return;
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let commandFile = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    try {
        if(commandFile) commandFile.run(client, message, args);
        client.log(`${client.bot_prefix}${client.user.username}: ${message.author.username}#${message.author.discriminator} used command: ${client.config.prefix}${command} (${message.guild.name})`);
    } catch(err) {
        return;
    }
};
