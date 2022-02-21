"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "help",
    description: "Shows the help menu or description for a command.",
    usage: "help {Command Name}",
    args: "multiple",
    commandGroup: "Utils",
    commandGroupName: "help",
    async execute(message, args, client) {
        const prefix = client.PREFIX;
        const botName = client.user?.username;
        const botTag = client.user?.tag;
        const botImage = client.user?.avatarURL();
        if (args.length == 0) {
            const helpEmbed = new discord_js_1.MessageEmbed()
                .setTitle(`Help module for ${botName} Discord Bot.`)
                .setDescription(`Welcome to the help module for ${botName} Discord Bot! Here you will find the list of commands that i may offer. If there seems to by a problem, Please contact an admin! Enjoy <3`)
                .addField("Usage: ", "`" + `${prefix} {command name}` + "`")
                .setAuthor(botTag)
                .setThumbnail(botImage)
                .setTimestamp()
                .setFooter({
                text: `- ${botName} loves you <3`
            });
            const commandGroups = client.MessageCommandGroups;
            for (const groups of commandGroups) {
                const groupName = groups[0].toUpperCase();
                const commandList = groups[1];
                const commandArray = [];
                for (const commands of commandList) {
                    const commandName = commands[1].name;
                    const parsedCommand = "`" + commandName + "`";
                    commandArray.push(parsedCommand);
                }
                const commandArrayString = commandArray.join(", ");
                helpEmbed.addField(groupName, commandArrayString);
            }
            return message.reply({
                embeds: [helpEmbed]
            });
        }
        else {
            const commandName = args[0];
            if (!client.MessageCommands.has(commandName))
                return message.reply("I can't seem to find this command! Are you sure you typed it correctly?");
            const commandData = client.MessageCommands.get(commandName);
            const { name, description, usage, commandGroup } = commandData;
            const helpEmbed = new discord_js_1.MessageEmbed()
                .setTitle(`Help module for ${botName} Discord Bot.`)
                .addField("Command:", name, true)
                .addField("Group:", commandGroup, true)
                .addField("Description:", description, true)
                .addField("Usage: ", "`" + `${prefix} ${usage}` + "`")
                .setAuthor({
                name: botTag,
            })
                .setThumbnail(botImage)
                .setTimestamp()
                .setFooter({
                text: `- ${botName} loves you <3`
            });
            return message.reply({
                embeds: [helpEmbed]
            });
        }
    }
};
