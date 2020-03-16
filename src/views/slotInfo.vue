<template>
  <div>
    <NoCompAlert />
    <runningSlotLarge />
    <CompDisplayCurrent />
  </div>
  <!-- <matrix /> -->
</template>

<script>
// @ is an alias to /src
import runningSlotLarge from '@/components/runningSlotLarge.vue'
import CompDisplayCurrent from '@/components/CompDisplayCurrent.vue'
import NoCompAlert from '@/components/NoCompAlert.vue'

export default {
  name: 'slotInfo',
  components: {
    runningSlotLarge,
    CompDisplayCurrent,
    NoCompAlert
    // matrix
  }
}
</script>
