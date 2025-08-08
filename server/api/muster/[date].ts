import { getItem } from '../../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const { date } = getRouterParams(event)
  const key = `muster:${date}`

  const list = await getItem<Array<{ name: string; rank?: string; location: string; time: string }>>(key)

  return Array.isArray(list) ? list : []
})
