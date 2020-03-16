<template>
  <div>
    <NoCompAlert />
    <RoundResults />
  </div>
  <!-- <matrix /> -->
</template>

<script>
// @ is an alias to /src
import RoundResults from '@/components/RoundResults.vue'
import NoCompAlert from '@/components/NoCompAlert.vue'

export default {
  name: 'results',
  components: {
    RoundResults,
    NoCompAlert
    // matrix
  }
}
</script>
