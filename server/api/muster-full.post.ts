import { eventBus } from '../utils/eventBus'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string
    rank: string
    location: string
    time: string
  }>(event)

  if (!body?.name || !body?.rank || !body?.location || !body?.time) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const timeOk = /^([01]\d|2[0-3]):[0-5]\d$/.test(body.time)
  if (!timeOk) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid time format. Use HH:MM (24h).' })
  }
  const {
    public: { expectedPersonnel },
  } = useRuntimeConfig()

  type Person = { name: string; title: string }
  let roster: Person[] = []
  try {
    const parsed: unknown = typeof expectedPersonnel === 'string' ? JSON.parse(expectedPersonnel) : expectedPersonnel
    roster = Array.isArray(parsed) ? (parsed as Person[]) : []
  } catch (e) {
    roster = []
  }

  const normalize = (s: string) => s.trim().toLowerCase()
  const person = roster.find((p) => normalize(p.name) === normalize(body.name))
  if (!person) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown person. Name is not on the roster.' })
  }

  if (normalize(person.title) !== normalize(body.rank)) {
    throw createError({ statusCode: 400, statusMessage: 'Rank does not match roster for the specified person.' })
  }

  const date = new Date().toISOString().split('T')[0]
  const key = `muster:${date}`

  const storage = useStorage()
  const list = (await storage.getItem<Array<{ name: string; rank: string; location: string; time: string }>>(key)) ?? []

  list.push({ name: body.name, rank: body.rank, location: body.location, time: body.time })

  await storage.setItem(key, list)

  // Broadcast live update
  eventBus.publish('muster-updated', { date, name: body.name })

  return { ok: true, date, entry: { name: body.name, rank: body.rank, location: body.location, time: body.time } }
})

