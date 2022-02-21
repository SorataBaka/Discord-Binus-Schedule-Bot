import { Message } from 'discord.js';
import { ClientExtensionInterface } from "../../types"
module.exports = {
  name: "setchannel",
  description: "sets the main alert channel",
  usage: "setChannel <channel>",
  args: "multiple",
  commandGroup: "Utils",
  commandGroupName: "setchannel",
  async execute(message: Message, args: string[] | string, client: ClientExtensionInterface) {
    if(args.length == 0) return message.reply("Please specify a channel!")
    const channel:string = message.mentions.channels.first()?.id || args[0]
    client.alertChannel = channel
    return message.reply("Alert channel set to " + `<@${channel}>`)
  }
}