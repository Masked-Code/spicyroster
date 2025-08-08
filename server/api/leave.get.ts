import { getItem } from '../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const filterDate = typeof q.date === 'string' ? new Date(q.date) : null
  const ids = (await getItem<string[]>('leave:list')) ?? []

  const items: any[] = []
  for (const id of ids) {
    const it = await getItem<any>(`leave:${id}`)
    if (!it) continue
    if (filterDate) {
      const s = new Date(it.startDate), e = new Date(it.endDate)
      if (filterDate < s || filterDate > e) continue
    }
    items.push(it)
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return items
})


