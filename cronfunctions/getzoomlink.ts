import axios from "axios"
import {
  ClientExtensionInterface
} from "../types"
const getzoomlink = async(client:ClientExtensionInterface) => {
  console.log("Cron Job: getzoomlink")
  const guildid = process.env.GUILD_ID as string
  const guild = client.guilds.cache.get(guildid)
  if(!guild) return
  const ongoing = await axios.request({
    method: "GET",
    url: "https://apim-bm7-prod.azure-api.net/func-bm7-course-prod/ClassSession/Upcoming/student",
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
    const classSchedule = ongoing.data
    if(classSchedule === undefined) continue
    if(classSchedule.classId !== classId) continue
    const zoomLink = classSchedule.joinUrl
    if(zoomLink === undefined) continue
    console.log(`${schedule[1].name} - ${zoomLink}`)
    await schedule[1].setLocation(zoomLink).catch()
  }
}
export default getzoomlink