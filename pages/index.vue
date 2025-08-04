<template>
  <div>
    <UCard class="m-4 mb-38">
      <div class="text-2xl text-primary font-bold m-6">Sailor Muster Input</div>
      <MusterInput @muster-submitted="refreshList" />
      <USeparator class="m-4" size="lg" />
      <div class="text-2xl text-primary font-bold m-6">Today's Muster List</div>
      <MusterList ref="musterList" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MusterInput from '@/components/MusterInput.vue'
import MusterList from '@/components/MusterList.vue'

const musterList = ref<InstanceType<typeof MusterList> | null>(null)

function refreshList() {
  setTimeout(() => {
    musterList.value?.fetchMusters()
  }, 100)
}
</script>
