<template>
  <div class="text-center"
  v-bind:class="{
    'bg-danger': !canFly,
    'bg-light': canFly,
    'text-dark': !canFly
  }">

    <div class="row">
      <div class="p-2 flex-fill h4 mb-0" v-bind:class="{'text-primary': canFly, 'text-light': !canFly}">Round: {{ round }}</div>
      <div class="p-2 flex-fill h4 mb-0" v-bind:class="{'text-primary': canFly, 'text-light': !canFly}"> Group: {{ group }}</div>
    </div>

    <div class="row">
      <div class="col-6 h1 mb-0 text-monospace" v-bind:class="{'text-primary': canFly, 'text-light': !canFly}">
        {{ timeString }}
      </div>
      <div class="col px-0 mb-0">
      <div class="col h6 align-self-center px-auto mb-0" v-bind:class="{'text-primary': canFly, 'text-light': !canFly}">
        {{ shortTaskDescription }}
        </div>
      <div class="col h4 px-auto text-monospace mb-0" v-bind:class="{'text-primary': canFly, 'text-light': !canFly}">
        {{ slotState }}
      </div>
      </div>
    </div>

</div>

</template>

<script>

import { mapState } from 'vuex'

function pad0 (value, count) {
  var result = value.toString()
  for (; result.length < count; --count) {
    result = '0' + result
  }
  return result
}

function formatTime (time, showTenths = false) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const fraction = (time * 10) % 10
  if (showTenths) {
    return `${pad0(minutes, 2)}:${pad0(seconds, 2)}.${Math.floor(fraction)}`
  } else { return `${pad0(minutes, 2)}:${pad0(seconds, 2)}` }
}

export default {
  name: 'runningSlotSmall',
  state: {
  },
  data () {
    return { timeRemaining: 0 }
  },
  computed: {
    ts () {
      return window.ts
    },
    timeString () {
      // console.log('calc remainin')
      return formatTime(this.timeRemaining)
    },
    ...mapState('comp', { compId: 'id' }),
    ...mapState('slot', [
      'round',
      'group',
      'canFly',
      'slotState',
      'shortTaskDescription'
    ])
  },
  mounted () {
    setInterval(() => {
      const timeLeft = (this.$store.state.slot.finishTime - this.ts.now()) / 1000
      if (timeLeft <= 0) {
        this.timeRemaining = 0
      } else {
        this.timeRemaining = timeLeft
      }
    }, 40)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
