"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "resetschedule",
    description: "Resets the schedule",
    usage: "resetschedule",
    args: "multiple",
    commandGroup: "Main",
    commandGroupName: "resetschedule",
    async execute(message, args, client) {
        const schedules = message.guild?.scheduledEvents.cache;
        for (const schedule of schedules) {
            const scheduleid = schedule[0];
            if (message.guild?.scheduledEvents.cache.has(scheduleid)) {
                await message.guild?.scheduledEvents.delete(scheduleid).catch();
            }
        }
        return message.reply("Schedule has been reset!");
    }
};
