<template>
  <div>
    <UCard class="m-4 mb-8">
      <div class="text-2xl text-primary font-bold m-6">Sailor Muster Input</div>
      <MusterInput @muster-submitted="refreshMusterList" />
      <USeparator class="m-4" size="lg" />
      <div class="text-2xl text-primary font-bold m-6">Today's Muster List</div>
      <MusterList ref="musterList" />
    </UCard>
    
    <UCard class="m-4 mb-38">
      <LeaveInput @leave-scheduled="refreshLeaveList" />
      <LeaveList ref="leaveList" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MusterInput from '@/components/MusterInput.vue'
import MusterList from '@/components/MusterList.vue'
import LeaveInput from '@/components/LeaveInput.vue'
import LeaveList from '@/components/LeaveList.vue'

const musterList = ref<InstanceType<typeof MusterList> | null>(null)
const leaveList = ref<InstanceType<typeof LeaveList> | null>(null)

function refreshMusterList() {
  setTimeout(() => {
    musterList.value?.fetchMusters()
  }, 100)
}

function refreshLeaveList() {
  setTimeout(() => {
    leaveList.value?.fetchLeave()
    // Also refresh muster list since leave affects the muster display
    musterList.value?.fetchMusters()
  }, 100)
}
</script>
