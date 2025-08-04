<template>
  <div>
    <UTable
      :data="data"
      :columns="columns"
      :sorting="sorting"
      class="m-4 mb-12"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

interface Person {
  name: string
  title: string
}

const columns: TableColumn<TableRow, unknown>[] = [
  { accessorKey: 'sailor',   header: 'Sailor' },
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
    const result = await $fetch<MusterEntry[]>(`/api/muster/${today}`)
    musters.value = Array.isArray(result) ? result : []

    data.value = expectedPeople.map((person: Person) => {
      const entry = musters.value.find((m) => m.name === person.name)
      return {
        sailor: `${person.title} ${person.name}`,     // ✅ "<RANK> <NAME>"
        location: entry?.location ?? '—',
        time: entry?.time ?? '—',
        status: entry ? '✅ Mustered' : '❌ Not Mustered'
      }
    })
  } catch (err) {
    console.error('Error fetching muster data:', err)
    data.value = []
  }
}

onMounted(fetchMusters)
defineExpose({ fetchMusters })
</script>
