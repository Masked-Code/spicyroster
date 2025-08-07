// server/api/leave/[date].ts
export default defineEventHandler(async (event) => {
  const { date } = getRouterParams(event)
  const queryDate = new Date(date)
  
  const storage = useStorage()
  const leaveListKey = 'leave:list'
  const leaveList = (await storage.getItem<string[]>(leaveListKey)) ?? []
  
  const activeLeave: Array<{
    id: string
    name: string
    startDate: string
    endDate: string
    leaveType: string
    createdAt: string
  }> = []
  
  // Check each leave request to see if it covers the requested date
  for (const leaveId of leaveList) {
    try {
      const leaveKey = `leave:${leaveId}`
      const leaveData = await storage.getItem(leaveKey)
      
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
        
        // Check if the query date falls within the leave period (inclusive)
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
