<template>
  <div>
    <NoCompAlert />
    <submitResults />
  </div>
</template>

<script>
// @ is an alias to /src
import submitResults from '@/components/submitResults.vue'
import NoCompAlert from '@/components/NoCompAlert.vue'

export default {
  name: 'Submit',
  components: {
    submitResults,
    NoCompAlert
  }
}
</script>

<style>
</style>
