import { getItem } from '../../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const { date } = getRouterParams(event)
  const queryDate = new Date(date)
  
  const leaveListKey = 'leave:list'
  const leaveList = (await getItem<string[]>(leaveListKey)) ?? []
  
  const activeLeave: Array<{
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
        
        const startDate = new Date(leave.startDate)
        const endDate = new Date(leave.endDate)
        
        if (queryDate >= startDate && queryDate <= endDate) {
          activeLeave.push(leave)
        }
      }
    } catch (error) {
      console.error(`Error processing leave ${leaveId}:`, error)
    }
  }
  
  return activeLeave
})
