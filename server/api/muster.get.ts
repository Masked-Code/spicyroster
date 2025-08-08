import { getItem } from '../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const date = typeof q.date === 'string' ? q.date : new Date().toISOString().split('T')[0]
  const list = await getItem<Array<{ name: string; rank?: string; location: string; time: string }>>(`muster:${date}`)
  return Array.isArray(list) ? list : []
})
