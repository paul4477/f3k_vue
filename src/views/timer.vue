<template>
  <div>
    <NoCompAlert />
      <runningSlotSmall />
      <stopwatch />
  </div>
</template>

<script>
// @ is an alias to /src
import runningSlotSmall from '@/components/runningSlotSmall.vue'
// import runningSlotLarge from '@/components/runningSlotLarge.vue'
import stopwatch from '@/components/stopwatch.vue'
import NoCompAlert from '@/components/NoCompAlert.vue'

export default {
  name: 'timer',
  components: {
    runningSlotSmall,
    // runningSlotLarge,
    stopwatch,
    NoCompAlert
  },
  data () {
    return { actionSubmit: false }
  },
  methods: {
    handleSubmit () {
      console.log('Outer timer.handleSubmit')
      if (!this.actionSubmit) {
        this.toggleAction()
      }
    },
    toggleAction (state, commit) {
      this.actionSubmit = !this.actionSumbmit
    }
  },
  created: function () {
    this.$parent.$on('action-submit-results', () => this.handleSubmit())
  }
}
</script>

<style>
#btnStartStop {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 48%;
  height: 38%;
}
#overlay {
  position: fixed;
  width: 100%;
  height: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0);
  z-index: 2;
  cursor: pointer;
}
</style>
