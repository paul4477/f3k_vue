<template>

  <div class="text-primary text-center"
  v-bind:class="{
    'bg-danger': !canFly,
    'bg-light': canFly,
    'text-dark': !canFly
  }">

    <div class="row">
      <div class="col flex-fill h1 px-auto mb-0 text-monospace" v-bind:class="{'text-primary': canFly, 'text-light': !canFly}">
        {{ slotState }}
      </div>
    </div>

    <div class="row">
      <div class="col flex-fill display-1 px-1 text-monospace" v-bind:class="{'text-primary': canFly, 'text-light': !canFly }">
        {{ timeString }}
      </div>
    </div>

    <div class="row">
      <div class="col flex-fill h1" v-bind:class="{'text-primary': canFly, 'text-light': !canFly }">
        <strong>{{ shortTaskDescription }}</strong>
        </div>
    </div>

    <div class="row">
      <div class="col-6 px-2 flex-fill h1 mb-0" v-bind:class="{'text-primary': canFly, 'text-light': !canFly }">Round</div>
      <div class="col-6 px-2 flex-fill h1 mb-0" v-bind:class="{'text-primary': canFly, 'text-light': !canFly }">Group</div>
      <div class="col-6 px-2 flex-fill h1" v-bind:class="{'text-primary': canFly, 'text-light': !canFly }">{{ round }}</div>
      <div class="col-6 px-2 flex-fill h1" v-bind:class="{'text-primary': canFly, 'text-light': !canFly }">{{ group }}</div>
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
  name: 'runningSlotLarge',
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
<style >
.bd-highlight {
  background-color: lightgrey;
  border: 1px solid grey;
}
</style>
