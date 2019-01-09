module.exports = async (client, member) => {
	try {
		let logs = member.guild.channel.find(`name`, "logs");
		logs.send(`${member} joined the server.`);
	} catch(err) {
		return;
	}
};
