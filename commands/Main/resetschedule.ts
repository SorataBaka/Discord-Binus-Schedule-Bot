import { GuildScheduledEvent, Message, Collection } from 'discord.js';
import { ClientExtensionInterface } from "../../types"

module.exports = {
  name: "resetschedule",
  description: "Resets the schedule",
  usage: "resetschedule",
  args: "multiple",
  commandGroup: "Main",
  commandGroupName: "resetschedule",
  async execute(message: Message, args: string[] | string, client: ClientExtensionInterface) {
    const schedules = message.guild?.scheduledEvents.cache as Collection<string, GuildScheduledEvent>
    for(const schedule of schedules){
      const scheduleid = schedule[0]
      if(message.guild?.scheduledEvents.cache.has(scheduleid)){
        await message.guild?.scheduledEvents.delete(scheduleid).catch()
      }
    }
    return message.reply("Schedule has been reset!")
  }
}