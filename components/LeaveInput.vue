<template>
  <div class="m-4">
    <div class="text-xl text-primary font-bold mb-4">Schedule Leave</div>
    <form
      @submit.prevent="handleFormSubmit"
      class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-6"
    >
      <UInputMenu
        v-model="name"
        :items="people"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        placeholder="Sailor's Name"
        size="xl"
        class="w-full sm:w-72"
      />
      <UInput
        type="date"
        v-model="startDate"
        placeholder="Start Date"
        required
        size="xl"
        class="w-full sm:w-48"
      />
      <UInput
        type="date"
        v-model="endDate"
        placeholder="End Date"
        required
        size="xl"
        class="w-full sm:w-48"
      />
      <USelectMenu v-model="leaveType" :items="leaveTypes" class="w-full sm:w-48" size="xl" />

      <UButton type="submit" size="xl" class="w-full sm:w-auto">
        Schedule Leave
      </UButton>
    </form>

    <div v-if="message" :class="messageClass" class="mt-4 p-3 rounded-md">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const name = ref('')
const startDate = ref('')
const endDate = ref('')
const leaveType = ref('')
const message = ref('')
const messageClass = ref('')
const emit = defineEmits(['leave-scheduled'])

const people = useExpectedPersonnel().map(p => p.name)
const leaveTypes = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Emergency Leave',
  'Training',
  'TDY',
  'Other'
]

function clearForm() {
  name.value = ''
  startDate.value = ''
  endDate.value = ''
  leaveType.value = ''
}

function showMessage(text: string, isError = false) {
  message.value = text
  messageClass.value = isError
    ? 'bg-red-100 text-red-800 border border-red-300'
    : 'bg-green-100 text-green-800 border border-green-300'

  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Normalize date for comparison (ignore time)
function normalizeDate(dateStr: string): Date {
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date
}

async function handleFormSubmit() {
  if (!name.value || !startDate.value || !endDate.value || !leaveType.value) {
    showMessage('Please fill in all fields', true)
    return
  }

  const start = normalizeDate(startDate.value)
  const end = normalizeDate(endDate.value)
  const today = normalizeDate(new Date().toISOString())

  if (start > end) {
    showMessage('End date must be after start date', true)
    return
  }

  if (start < today) {
    showMessage('Leave cannot be scheduled for past dates', true)
    return
  }

  try {
    await $fetch('/api/leave', {
      method: 'POST',
      body: {
        name: name.value,
        startDate: startDate.value,
        endDate: endDate.value,
        leaveType: leaveType.value
      }
    })

    showMessage('Leave scheduled successfully')
    clearForm()
    emit('leave-scheduled')
  } catch (err: any) {
    console.error('POST /api/leave failed:', err?.data ?? err)
    showMessage('Failed to schedule leave. Please try again.', true)
  }
}
</script>
