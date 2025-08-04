export default defineEventHandler(async (event) => {
  const params = event.context.params as { date: string }
  const date = params?.date
  const storage = useStorage()
  const key = `muster-${date}`
  const data = await storage.getItem(key)
  return data || []
})
