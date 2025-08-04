export default defineEventHandler(async (event) => {
  const { date } = getRouterParams(event)
  const key = `muster:${date}`

  const storage = useStorage()
  const list = await storage.getItem<Array<{ name: string; location: string; time: string }>>(key)

  return Array.isArray(list) ? list : []
})
