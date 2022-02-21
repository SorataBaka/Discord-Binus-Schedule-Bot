import { Client, Intents, Collection, GuildMember } from "discord.js"
import { Command, Events, ClientExtensionInterface } from "./types"
import "dotenv/config"
import cron from "node-cron"
// import ClientAPI from "./unsused/ClientAPI"
import fs from "fs"
console.clear()
if(!process.env.TOKEN || !process.env.PREFIX || !process.env.BINUS_TOKEN || !process.env.BINUS_ROLEID ) {
    console.error("Environmental variable for TOKEN, PREFIX, and URI is needed.")
    process.exit(1)
}

//Process all required ENV's
const TOKEN = process.env.TOKEN as string

//Set bot intents
const intents:Intents = new Intents()
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_SCHEDULED_EVENTS)

//Create new client
export default class ClientExtension extends Client implements ClientExtensionInterface{
  public MessageCommands:Collection<string, Command>
  public MessageCommandGroups:Collection<string, Collection<string, Command>>
  public EventCollection:Collection<string, Events>
  // public ClientAPI:ClientAPIInterface
  public PREFIX = process.env.PREFIX as string
  public JWTToken = process.env.BINUS_TOKEN as string
  public roleID = process.env.BINUS_ROLEID as string
  public activeCommands = new Collection<string, GuildMember>()
  public constructor(intents:Intents) {
      super({ intents: intents })
      this.MessageCommands = new Collection()
      this.MessageCommandGroups = new Collection()
      this.EventCollection = new Collection()
      // this.ClientAPI = new ClientAPI()
  }
}
const client:ClientExtension = new ClientExtension(intents)
//Read every command in every subfolder of commands directory
const commandFolderPath:string = __dirname + "/commands"
const eventFolderPath:string = __dirname + "/events"

const subCommandFolder:string[] = fs.readdirSync(commandFolderPath)
const subEventFolder:string[] = fs.readdirSync(eventFolderPath)

for(const subFolder of subCommandFolder){
  const commands:string[] = fs.readdirSync(`${commandFolderPath}/${subFolder}`)
  for(const commandFile of commands){
    const command:Command = require(`${commandFolderPath}/${subFolder}/${commandFile}`)
    if(client.MessageCommands.has(command.name)) throw "Duplicate Command Name detected. Aborting startup."
    client.MessageCommands.set(command.name, command)
    if(client.MessageCommandGroups.has(command.commandGroup)){
      client.MessageCommandGroups.get(command.commandGroup)?.set(command.name, command)
    } else {
      const newGroup:Collection<string, Command> = new Collection()
      newGroup.set(command.name, command)
      client.MessageCommandGroups.set(command.commandGroup, newGroup)
    }
  }
}
for(const eventFile of subEventFolder){
  const event:Events = require(`${eventFolderPath}/${eventFile}`)
  client.EventCollection.set(event.name, event)
  client.on(event.eventName, (...args:any) => {event.execute(...args, client)})
}

import createSchedule from "./cronfunctions/createschedule"
import getzoomlink from "./cronfunctions/getzoomlink"
//Login the bot
client.login(TOKEN).then((data:any) => {
  if(data) console.log("Login Successful")
  else console.log("Failed login")
  cron.schedule("0 0 0 1 * *", function(){
    createSchedule(client)
  })
  cron.schedule("*/10 * * * *", function(){
    getzoomlink(client)
  })
  
  getzoomlink(client)
  createSchedule(client)
}).catch((error:Error) => {
  console.log(`Attempted login with token ${TOKEN} Failed`)
  console.error(error)
  client.destroy()
  console.log("Shutting down")
  process.exit(1)
})
export { client }
process.on("SIGINT" || "SIGTERM", () => {
  console.log("Shutting down")
  client.destroy()
  process.exit(0)
})