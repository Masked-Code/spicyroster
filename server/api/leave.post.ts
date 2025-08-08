import { getItem, setItem } from '../utils/persistentStorage'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ 
    name: string; 
    startDate: string; 
    endDate: string; 
    leaveType: string 
  }>(event)

  if (!body?.name || !body?.startDate || !body?.endDate || !body?.leaveType) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const startDate = new Date(body.startDate)
  const endDate = new Date(body.endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (startDate > endDate) {
    throw createError({ statusCode: 400, statusMessage: 'End date must be after start date' })
  }

  if (startDate < today) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot schedule leave for past dates' })
  }

  const leaveId = `${body.name}-${body.startDate}-${Date.now()}`
  const leaveKey = `leave:${leaveId}`
  
  const leaveData = {
    id: leaveId,
    name: body.name,
    startDate: body.startDate,
    endDate: body.endDate,
    leaveType: body.leaveType,
    createdAt: new Date().toISOString()
  }

  await setItem(leaveKey, leaveData)
  
  const leaveListKey = 'leave:list'
  const leaveList = (await getItem<string[]>(leaveListKey)) ?? []
  leaveList.push(leaveId)
  await setItem(leaveListKey, leaveList)

  return { ok: true, leaveId }
})

