<template>
  <div class="m-4 mb-12 overflow-x-auto">
    <UTable
      :data="data"
      :columns="columns"
      :sorting="sorting"
      class="min-w-[720px] whitespace-nowrap"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import type { TableColumn } from '#ui/types'
import type { SortingState } from '@tanstack/vue-table'

interface TableRow {
  sailor: string
  location: string
  time: string
  status: string
}

interface MusterEntry {
  name: string
  location: string
  time: string
}

interface LeaveEntry {
  id: string
  name: string
  startDate: string
  endDate: string
  leaveType: string
  createdAt: string
}

interface Person {
  name: string
  title: string
}

const columns: TableColumn<TableRow, unknown>[] = [
  {
    accessorKey: 'sailor',
    header: 'Sailor',
    cell: ({ row, getValue }) => {
      const status = (row.getValue?.('status') as string) ?? row.original.status
      let cls = ''
      if (status?.includes('✅')) cls = 'text-primary'
      else if (status?.includes('🏖️')) cls = 'text-blue-600'
      return h('span', { class: cls }, getValue() as string)
    }
  },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'time',     header: 'Time' },
  { accessorKey: 'status',   header: 'Status' },
]

const sorting = ref<SortingState>([
  { id: 'sailor', desc: false }
])

const expectedPeople = useExpectedPersonnel()
const musters = ref<MusterEntry[]>([])
const data = ref<TableRow[]>([])

async function fetchMusters() {
  const today = new Date().toISOString().split('T')[0]
  try {
    // Fetch both musters and leave data for today
    const [musterResult, leaveResult] = await Promise.all([
      $fetch<MusterEntry[]>(`/api/muster/${today}`),
      $fetch<LeaveEntry[]>(`/api/leave/${today}`)
    ])
    
    musters.value = Array.isArray(musterResult) ? musterResult : []
    const todayLeave = Array.isArray(leaveResult) ? leaveResult : []

    data.value = expectedPeople.map((person: Person) => {
      const entry = musters.value.find((m) => m.name === person.name)
      const leaveEntry = todayLeave.find((l) => l.name === person.name)
      
      // If person is on leave, show leave status
      if (leaveEntry) {
        return {
          sailor: `${person.title} ${person.name}`,
          location: `On ${leaveEntry.leaveType}`,
          time: 'All Day',
          status: '🏖️ On Leave'
        }
      }
      
      // Otherwise show normal muster status
      return {
        sailor: `${person.title} ${person.name}`,
        location: entry?.location ?? '—',
        time: entry?.time ?? '—',
        status: entry ? '✅ Mustered' : '❌ Not Mustered'
      }
    })
  } catch (err: any) {
    console.error('GET /api/muster or leave failed:', err?.data ?? err)
    data.value = expectedPeople.map((person: Person) => ({
      sailor: `${person.title} ${person.name}`,
      location: '—',
      time: '—',
      status: '❌ Not Mustered'
    }))
  }
}

onMounted(() => {
  fetchMusters()
  const { connect, disconnect } = useMusterLive(() => fetchMusters())
  connect()
  onUnmounted(disconnect)
})

defineExpose({ fetchMusters })
</script>
