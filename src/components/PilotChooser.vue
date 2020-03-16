<template>
  <form>
    <div class="form-inline my-3">
    <select class="form-control form-control-lg" id="pilot" v-model="$store.state.result.pilotNo" >
      <option value="0" >Select a pilot...</option>
      <option v-for="pilotID in Object.keys(pilots)" :key="pilotID._id" v-bind:value="pilotID">{{ pilots[pilotID].name }}</option>
    </select>
    </div>
    <!-- <button v-on:click="setCompID" class="btn btn-primary">Set Competition</button> -->
    </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PilotChooser',
  computed: {
    ...mapState('comp', {
      compId: 'id',
      pilots: 'pilots',
      selectedPilot: 'selectedPilot'
    }),
    ...mapState('result', {
      selectedPilot: 'pilotNo'
    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
