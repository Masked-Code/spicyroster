<template>
  <form
    @submit.prevent="handleFormSubmit"
    class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-6 ml-4"
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
      type="text"
      v-model="location"
      placeholder="Location"
      required
      size="xl"
      class="w-full sm:w-64"
    />
    <UInput
      type="time"
      v-model="time"
      required
      size="xl"
      class="w-full sm:w-auto flex-shrink-0 min-w-[9rem]"
    />

    <UButton type="submit" size="xl" class="w-full sm:w-auto">
      Muster
    </UButton>
  </form>
</template>

<script setup lang="ts">
const name = ref('')
const location = ref('')
const time = ref('')
const emit = defineEmits(['muster-submitted'])

const people = useExpectedPersonnel().map(p => p.name)

async function handleFormSubmit() {
  try {
    await $fetch('/api/muster', {
      method: 'POST',
      body: { name: name.value, location: location.value, time: time.value }
    })
    name.value = ''
    location.value = ''
    time.value = ''
    emit('muster-submitted')
  } catch (err: any) {
    console.error('POST /api/muster failed:', err?.data ?? err)
  }
}
</script>
