module.exports = async (client, member) => {
	try {
		let logs = member.guild.channel.find(`name`, "logs");
		logs.send(`${member} left the server.`);
	} catch(err) {
		return;
	}
};
