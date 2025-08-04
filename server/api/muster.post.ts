export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string
    location: string
    time: string
  }>(event)
  const date = new Date().toISOString().split('T')[0]
  const key = `muster-${date}`
  const storage = useStorage()
  const current = (await storage.getItem(key)) as {
    name: string
    location: string
    time: string
  }[] || []
  current.push({
    name: body.name,
    location: body.location,
    time: body.time
  })
  await storage.setItem(key, current)
  return {
    status: 'Muster recorded',
    count: current.length
  }
})
