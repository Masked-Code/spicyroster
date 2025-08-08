<template>
  <div class="m-4 mb-12">
    <div class="text-xl text-primary font-bold mb-4">Scheduled Leave</div>

    <div v-if="loading" class="text-center py-4">Loading leave data...</div>
    <div v-else-if="!leaveData.length" class="text-gray-500 py-4">No scheduled leave found.</div>
    <div v-else class="overflow-x-auto">
      <UTable
        :data="leaveData"
        :columns="columns"
        :sorting="sorting"
        class="min-w-[720px] whitespace-nowrap"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import type { TableColumn } from '#ui/types'
import type { SortingState } from '@tanstack/vue-table'

interface LeaveTableRow {
  sailor: string
  leaveType: string
  startDate: string
  endDate: string
  duration: string
  status: string
}

interface LeaveEntry {
  id: string
  name: string
  startDate: string
  endDate: string
  leaveType: string
  createdAt: string
}

const columns: TableColumn<LeaveTableRow, unknown>[] = [
  { accessorKey: 'sailor', header: 'Sailor' },
  { accessorKey: 'leaveType', header: 'Leave Type' },
  { accessorKey: 'startDate', header: 'Start Date' },
  { accessorKey: 'endDate', header: 'End Date' },
  { accessorKey: 'duration', header: 'Duration' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string
      let cls = ''
      if (status === 'Active') cls = 'text-blue-600 font-medium'
      else if (status === 'Upcoming') cls = 'text-green-600 font-medium'
      else if (status === 'Past') cls = 'text-gray-500'

      return h('span', { class: cls }, status)
    }
  }
]

const sorting = ref<SortingState>([
  { id: 'startDate', desc: false }
])

const expectedPeople = useExpectedPersonnel()
const leaveData = ref<LeaveTableRow[]>([])
const loading = ref(true)

function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
}

function getLeaveStatus(startDate: string, endDate: string): string {
  const today = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  today.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  if (today >= start && today <= end) return 'Active'
  if (today < start) return 'Upcoming'
  return 'Past'
}

function findPersonTitle(name: string): string {
  const person = expectedPeople.find(p => p.name === name)
  return person ? `${person.title} ${person.name}` : name
}

async function fetchLeave() {
  loading.value = true
  try {
    const response = await $fetch<LeaveEntry[]>('/api/leave')
    const allLeave = Array.isArray(response) ? response : []

    leaveData.value = allLeave.map((leave) => ({
      sailor: findPersonTitle(leave.name),
      leaveType: leave.leaveType,
      startDate: new Date(leave.startDate).toLocaleDateString(),
      endDate: new Date(leave.endDate).toLocaleDateString(),
      duration: calculateDuration(leave.startDate, leave.endDate),
      status: getLeaveStatus(leave.startDate, leave.endDate)
    }))

    leaveData.value.sort((a, b) => {
      const statusOrder = { 'Active': 0, 'Upcoming': 1, 'Past': 2 }
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3
      if (aOrder !== bOrder) return aOrder - bOrder
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  } catch (err: any) {
    console.error('Failed to fetch leave data:', err?.data ?? err)
    leaveData.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchLeave)
defineExpose({ fetchLeave })
</script>
