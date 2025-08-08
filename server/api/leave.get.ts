import { getItem } from '../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const leaveListKey = 'leave:list'
  const leaveList = (await getItem<string[]>(leaveListKey)) ?? []
  
  const allLeave: Array<{
    id: string
    name: string
    startDate: string
    endDate: string
    leaveType: string
    createdAt: string
  }> = []
  
  for (const leaveId of leaveList) {
    try {
      const leaveKey = `leave:${leaveId}`
      const leaveData = await getItem(leaveKey)
      
      if (leaveData && typeof leaveData === 'object') {
        const leave = leaveData as {
          id: string
          name: string
          startDate: string
          endDate: string
          leaveType: string
          createdAt: string
        }
        
        allLeave.push(leave)
      }
    } catch (error) {
      console.error(`Error fetching leave ${leaveId}:`, error)
    }
  }
  
  allLeave.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  return allLeave
})

