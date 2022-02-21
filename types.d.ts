import { Message, Client, Collection, GuildMember } from 'discord.js';
export interface Command {
  name: string
  description: string
  usage: string
  args: "single" | "multiple"
  commandGroup: string
  commandGroupName: string
  execute(message: Message, args: string[]|string, client: Client):Promise<any>
}
export interface Events {
  name: string
  eventName: string
  description: string
  execute:Function
}
export interface ClientExtensionInterface extends Client{
  MessageCommands:Collection<string, Command>
  MessageCommandGroups:Collection<string, Collection<string, Command>>
  EventCollection:Collection<string, Events>
  PREFIX:string
  alertChannel:string
  JWTToken:string
  roleID:string
}