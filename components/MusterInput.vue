<template>
  <form @submit.prevent="handleFormSubmit"  class="flex items-center flex-wrap">
    <UInputMenu
      v-model="name"
      :items="people"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
      class="m-4 text-xl"
      size="xl"
      placeholder="Sailor's Name"
    />
    <UInput type="text" v-model="location" placeholder="Location" required class="m-4 text-xl" size="xl"/>
    <UInput type="time" v-model="time" required class="m-4 text-xl" size="xl"/>
    <UButton type="submit" class="m-4 text-xl" size="xl">Muster</UButton>
  </form>
</template>

<script setup lang="ts">
const name = ref('')
const location = ref('')
const time = ref('')
const emit = defineEmits(['muster-submitted'])

const people = useExpectedPersonnel().map(p => p.name)

async function handleFormSubmit() {
  await $fetch('/api/muster', {
    method: 'POST',
    body: {
      name: name.value,
      location: location.value,
      time: time.value
    }
  })

  name.value = ''
  location.value = ''
  time.value = ''

  emit('muster-submitted')
}
</script>
