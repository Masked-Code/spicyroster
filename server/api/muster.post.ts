// server/api/muster.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; location: string; time: string }>(event)

  if (!body?.name || !body?.location || !body?.time) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  const date = new Date().toISOString().split('T')[0]
  const key = `muster:${date}`

  const storage = useStorage()
  const list = (await storage.getItem<Array<{ name: string; location: string; time: string }>>(key)) ?? []

  list.push({ name: body.name, location: body.location, time: body.time })

  await storage.setItem(key, list)

  return { ok: true }
})
