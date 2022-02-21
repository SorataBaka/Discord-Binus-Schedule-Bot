"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
require("dotenv/config");
const node_cron_1 = __importDefault(require("node-cron"));
const createschedule_1 = __importDefault(require("./cronfunctions/createschedule"));
const getzoomlink_1 = __importDefault(require("./cronfunctions/getzoomlink"));
const fs_1 = __importDefault(require("fs"));
console.clear();
if (!process.env.TOKEN || !process.env.PREFIX || !process.env.BINUS_TOKEN || !process.env.BINUS_ROLEID || !process.env.GUILD_ID) {
    console.error("Environmental variable for TOKEN, PREFIX, and URI is needed.");
    process.exit(1);
}
//Process all required ENV's
const TOKEN = process.env.TOKEN;
//Set bot intents
const intents = new discord_js_1.Intents();
intents.add(discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_PRESENCES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord_js_1.Intents.FLAGS.GUILD_SCHEDULED_EVENTS);
//Create new client
class ClientExtension extends discord_js_1.Client {
    MessageCommands;
    MessageCommandGroups;
    EventCollection;
    // public ClientAPI:ClientAPIInterface
    PREFIX = process.env.PREFIX;
    JWTToken = process.env.BINUS_TOKEN;
    roleID = process.env.BINUS_ROLEID;
    activeCommands = new discord_js_1.Collection();
    constructor(intents) {
        super({ intents: intents });
        this.MessageCommands = new discord_js_1.Collection();
        this.MessageCommandGroups = new discord_js_1.Collection();
        this.EventCollection = new discord_js_1.Collection();
        // this.ClientAPI = new ClientAPI()
    }
}
exports.default = ClientExtension;
const client = new ClientExtension(intents);
exports.client = client;
//Read every command in every subfolder of commands directory
const commandFolderPath = __dirname + "/commands";
const eventFolderPath = __dirname + "/events";
const subCommandFolder = fs_1.default.readdirSync(commandFolderPath);
const subEventFolder = fs_1.default.readdirSync(eventFolderPath);
for (const subFolder of subCommandFolder) {
    const commands = fs_1.default.readdirSync(`${commandFolderPath}/${subFolder}`);
    for (const commandFile of commands) {
        const command = require(`${commandFolderPath}/${subFolder}/${commandFile}`);
        if (client.MessageCommands.has(command.name))
            throw "Duplicate Command Name detected. Aborting startup.";
        client.MessageCommands.set(command.name, command);
        if (client.MessageCommandGroups.has(command.commandGroup)) {
            client.MessageCommandGroups.get(command.commandGroup)?.set(command.name, command);
        }
        else {
            const newGroup = new discord_js_1.Collection();
            newGroup.set(command.name, command);
            client.MessageCommandGroups.set(command.commandGroup, newGroup);
        }
    }
}
for (const eventFile of subEventFolder) {
    const event = require(`${eventFolderPath}/${eventFile}`);
    client.EventCollection.set(event.name, event);
    client.on(event.eventName, (...args) => { event.execute(...args, client); });
}
//Login the bot
client.login(TOKEN).then((data) => {
    if (data)
        console.log("Login Successful");
    else
        console.log("Failed login");
    //Initialize cron jobs
    node_cron_1.default.schedule("0 0 0 1 * *", function () {
        (0, createschedule_1.default)(client);
    });
    node_cron_1.default.schedule("*/10 * * * *", function () {
        (0, getzoomlink_1.default)(client);
    });
    (0, getzoomlink_1.default)(client);
    (0, createschedule_1.default)(client);
}).catch((error) => {
    console.log(`Attempted login with token ${TOKEN} Failed`);
    console.error(error);
    client.destroy();
    console.log("Shutting down");
    process.exit(1);
});
process.on("SIGINT" || "SIGTERM", () => {
    console.log("Shutting down");
    client.destroy();
    process.exit(0);
});
