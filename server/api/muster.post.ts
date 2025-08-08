import { eventBus } from '../utils/eventBus'
import { getItem, setItem } from '../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; rank?: string; location: string; time: string }>(event)
  if (!body?.name || !body?.location || !body?.time) throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time)) throw createError({ statusCode: 400, statusMessage: 'Invalid time format. Use HH:MM (24h).' })

  const { public: { expectedPersonnel } } = useRuntimeConfig()
  const roster = parseRoster(expectedPersonnel)
  const norm = (s: string) => s.trim().toLowerCase()
  const person = roster.find(p => norm(p.name) === norm(body.name))
  if (!person) throw createError({ statusCode: 400, statusMessage: 'Unknown person. Name is not on the roster.' })
  if (body.rank && norm(person.title) !== norm(body.rank)) throw createError({ statusCode: 400, statusMessage: 'Rank does not match roster for the specified person.' })

  const date = new Date().toISOString().split('T')[0]
  const key = `muster:${date}`
  const list = (await getItem<Array<{ name: string; rank?: string; location: string; time: string }>>(key)) ?? []
  list.push({ name: body.name, rank: body.rank ?? person.title, location: body.location, time: body.time })
  await setItem(key, list)

  eventBus.publish('muster-updated', { date, name: body.name })
  return { ok: true, date }
})

function parseRoster(expected: unknown): Array<{ name: string; title: string }> {
  try {
    const parsed = typeof expected === 'string' ? JSON.parse(expected) : expected
    return Array.isArray(parsed) ? (parsed as Array<{ name: string; title: string }>) : []
  } catch {
    return []
  }
}

