module.exports = async client => {
    client.log(client.bot_prefix + `${client.user.username} is now online! Server(s): ${client.guilds.size}`);
    client.user.setActivity(client.config.activity), {type: "PLAYING"};
    client.user.setStatus("online");
};
