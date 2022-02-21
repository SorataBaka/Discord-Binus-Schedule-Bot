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
  const schedules = await guild.scheduledEvents.cache
  for(const schedule of schedules){
    const description = schedule[1].description as string
    const classId = description.split("ID: ")[1]
    if(classId === undefined) continue
    const classSchedule = ongoing.data.data.filter((value:any) => {
      return value.classId === classId
    })
    if(classSchedule[0] === undefined) continue
    const zoomLink = classSchedule[0].joinUrl
    console.log(`${schedule[1].name} - ${zoomLink}`)
    if(zoomLink === undefined) continue
    schedule[1].setLocation(zoomLink)
  }
}
export default getzoomlink