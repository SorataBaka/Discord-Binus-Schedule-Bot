"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "mentioned",
    eventName: "messageCreate",
    async execute(message, client) {
        if (message.mentions.repliedUser != null)
            return;
        if (message.mentions.members?.has(client.user?.id)) {
            const prefix = client.PREFIX;
            return message.reply(`Hi! My prefix is ` + "`" + prefix + "`.").catch();
        }
    }
};
