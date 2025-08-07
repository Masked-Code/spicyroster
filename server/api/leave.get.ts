// server/api/leave.get.ts
export default defineEventHandler(async (event) => {
  const storage = useStorage()
  const leaveListKey = 'leave:list'
  const leaveList = (await storage.getItem<string[]>(leaveListKey)) ?? []
  
  const allLeave: Array<{
    id: string
    name: string
    startDate: string
    endDate: string
    leaveType: string
    createdAt: string
  }> = []
  
  // Fetch each leave request
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
        
        allLeave.push(leave)
      }
    } catch (error) {
      console.error(`Error fetching leave ${leaveId}:`, error)
    }
  }
  
  // Sort by creation date (newest first)
  allLeave.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  return allLeave
})

