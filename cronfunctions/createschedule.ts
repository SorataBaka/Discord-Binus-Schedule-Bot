import {
  ClientExtensionInterface
} from "../types"
import axios, { AxiosResponse } from "axios"
import { GuildScheduledEvent } from "discord.js"
const createschedule = async (client: ClientExtensionInterface) => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID as string)
  if(!guild) return
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const fullDate = `${year}-${month}-${day}`
  const JWTToken = client.JWTToken
  const roleID = client.roleID
  // const alertChannel = client.alertChannel
  const schedule: AxiosResponse = await axios.request({
    method: "POST",
    url: `https://func-bm7-schedule-prod.azurewebsites.net/api/Schedule/Month-v1/${fullDate}`,
    headers: {
      "Authorization": JWTToken,
      "roleName": "Student",
      "roleId": roleID,
      "institution": "BNS01"
    },
    data: {}
  })
  for (const days of schedule.data) {
    for (const schedule of days.Schedule) {
      //Verify if this schedule already exists
      const dateStart = schedule.dateStart
      const dateEnd = schedule.dateEnd
      const content = schedule.content
      const deliveryMode = schedule.deliveryModeDesc
      const location = schedule.location
      const session = schedule.customParam.sessionNumber
      const scheduleExists = guild?.scheduledEvents.cache.filter((value: GuildScheduledEvent, key: string) => {
        return value.name === `${content} - Session ${session}`
      }).first()
      if (scheduleExists !== undefined) {
        continue
      }
      await guild?.scheduledEvents.create({
        name: `${content} - Session ${session}`,
        scheduledStartTime: dateStart,
        scheduledEndTime: dateEnd,
        privacyLevel: "GUILD_ONLY",
        description: `${content} \n ${deliveryMode} \n ${location === null?"No location":location}`,
        entityType: "EXTERNAL",
        entityMetadata: {
          location: location === null ? "No location" : location,
        }
      })
    }
  }
}
export default createschedule