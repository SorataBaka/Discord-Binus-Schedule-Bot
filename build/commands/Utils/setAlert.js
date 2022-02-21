"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "setchannel",
    description: "sets the main alert channel",
    usage: "setChannel <channel>",
    args: "multiple",
    commandGroup: "Utils",
    commandGroupName: "setchannel",
    async execute(message, args, client) {
        if (args.length == 0)
            return message.reply("Please specify a channel!");
        const channel = message.mentions.channels.first()?.id || args[0];
        client.alertChannel = channel;
        return message.reply("Alert channel set to " + `<@${channel}>`);
    }
};
