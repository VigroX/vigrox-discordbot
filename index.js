const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});

bot.on('ready', async () => {
	console.log(`${bot.user.username} is online!`);
	bot.user.setActivity('with code.', {type: "Playing"});
});

bot.on('message', async message => {
	if(message.author.bot) return;
	if(message.channel.type === 'dm') return;
	
	if(message.content == 'ping') { // Test Ping
		message.channel.send('pong');
	}
	
});

bot.login(process.env.token);