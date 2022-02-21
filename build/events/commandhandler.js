"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "commandhandler",
    eventName: "messageCreate",
    async execute(message, client) {
        if (message.member?.user.bot)
            return;
        const prefix = client.PREFIX;
        if (message.author.bot)
            return;
        if (!message.content)
            return;
        const temporary = message.content.toUpperCase();
        if (temporary.indexOf(prefix.toUpperCase()) !== 0)
            return;
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args[0].toLowerCase();
        if (!client.MessageCommands.has(commandName))
            return message.reply("I can't seem to find this command! Are you sure you typed it correctly?");
        args.shift();
        const command = client.MessageCommands.get(commandName);
        if (command.args == "single") {
            args = args.join(" ");
        }
        if (client.activeCommands.has(message.author.id))
            return message.reply("You are already running a command!");
        client.activeCommands.set(message.author.id, message.member);
        await command.execute(message, args, client).catch();
        return client.activeCommands.delete(message.author.id);
    }
};
