module.exports = async (client, channel) => {
	try {
		let logs = channel.guild.channels.find(channel => channel.name === "logs");
		logs.send(`Channel Deleted: #${channel.name}`);
	} catch(err) {
		return;
	}
};
