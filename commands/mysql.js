exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.reply(":no_entry_sign: You do not have permission!");
    }
    client.setProperty("config", "version", "1.3", () => {
        message.reply("Updated Version to 1.3");
    });
};

exports.config = {
    name: "mysql",
    aliases: ["sql", "db", "database"],
    usage: "mysql",
    description: "Configure the MySQL database.",
    accessableby: "Staff"
};
