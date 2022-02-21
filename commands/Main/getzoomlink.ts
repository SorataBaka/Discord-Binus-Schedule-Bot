import { Message } from 'discord.js';
import { ClientExtensionInterface } from "../../types"
import axios, { AxiosResponse } from "axios"

module.exports = {
  name: "getzoomlinks",
  description: "Gets available zoom links from the binus API",
  usage: "getzoomlink",
  args: "multiple",
  commandGroup: "Main",
  commandGroupName: "getzoomlinks",
  async execute(message: Message, args: string[] | string, client: ClientExtensionInterface) {
    const guild = message.guild
    if(!guild) return
    const ongoing:AxiosResponse|undefined = await axios.request({
      method: "GET",
      url: "https://apim-bm7-prod.azure-api.net/func-bm7-course-prod/ClassSession/Ongoing/student",
      headers: {
        "Authorization": client.JWTToken,
        "roleName": "Student",
        "roleId": client.roleID,
        "institution": "BNS01",
        "academicCareer": "RS1"
      },
    }).catch((err:Error) => {
      console.error(err)
      return undefined
    })
    if(ongoing === undefined) return console.log("Error getting ongoing classes")
    const schedules = guild.scheduledEvents.cache
    for(const schedule of schedules){
      const description = schedule[1].description as string
      if(description === null) continue
      const classId = description.split("ID: ")[1]
      if(classId === undefined) continue
      console.log(classId)
      const classSchedule = ongoing.data.data.filter((value:any) => {
        return value.classId === classId
      })
      if(classSchedule[0] === undefined) continue
      const zoomLink = classSchedule[0].joinUrl
      if(zoomLink === undefined) continue
      message.channel.send(`${schedule[1].name} - ${zoomLink}`)
      await schedule[1].setLocation(zoomLink).catch(async(err:Error) => {
        await message.channel.send(`Error setting location for ${schedule[1].name} with link ${zoomLink}`).catch()
      })    
    }
    return message.channel.send("Done pasrsing any available zoom links")
  }
}