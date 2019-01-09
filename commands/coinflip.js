exports.run = async (bot, message, args) => {
    let result = Math.floor((Math.random() * 2) + 1);
    if (result == 1) {
        message.reply("The coin landed on *heads*!");
    } else if (result == 2) {
        message.reply("The coin landed on *tails*!");
    } else {
        message.reply("Retry!");
    }
};

exports.config = {
    name: "coinflip",
    aliases: ["flip", "coin", "flipcoin", "fc", "cf"],
    usage: "coinflip",
    description: "Flip a coin.",
    accessableby: "Members"
};
