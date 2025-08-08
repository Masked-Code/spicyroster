import { eventBus } from '../utils/eventBus'
import { getItem, setItem } from '../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; location: string; time: string }>(event)

  if (!body?.name || !body?.location || !body?.time) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  const date = new Date().toISOString().split('T')[0]
  const key = `muster:${date}`

  const list = (await getItem<Array<{ name: string; location: string; time: string }>>(key)) ?? []

  list.push({ name: body.name, location: body.location, time: body.time })

  await setItem(key, list)

  eventBus.publish('muster-updated', { date, name: body.name })

  return { ok: true }
})
