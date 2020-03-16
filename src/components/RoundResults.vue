<template>
<div>
<transition name="fade">
      <table v-if="!isLoading && compIsLoaded" class="table table-sm table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col" colspan="2">Round: {{ $route.params.displayRound }}</th>
          </tr>
          <tr>
            <th scope="row"  colspan="2">Task: {{ rounds[parseInt($route.params.displayRound)].F3KTaskAbbreviation }}</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="pilot in scores" :key=pilot._id>
            <th scope="row">{{ pilot.name }}</th>
            <td scope="col" >{{ pilot.time | secondsToString }}</td>
          </tr>
        </tbody>
      </table>
</transition>
<button
              class="btn btn-block btn-success active py-2"
              v-on:click="setRoundScores"
              type="submit">
                Refresh
              </button>
              </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
const API_URL = '/api/comp/'

/* global enableScroll */
enableScroll()

export default {
  name: 'RoundResults',
  data: () => ({
    isLoading: true,
    scores: { }
  }),
  computed: {
    ...mapState('comp', {
      compId: 'id',
      rounds: 'rounds',
      pilots: 'pilots',
      compIsLoaded: 'compIsLoaded'
    }),
    ...mapState('slot', {
      currentRound: state => state.round,
      currentGroup: state => state.group
    })
  },
  watch: {
    $route (to, from) {
      this.setRoundScores()
    }
  },
  methods: {
    setRoundScores () {
      if (this.compIsLoaded) {
        this.isLoading = true
        axios.get(API_URL + `${this.$store.state.comp.id}/round/${this.$route.params.displayRound}/score`)
          .then(response => {
            console.log(response.data)
            for (let i = 0; i < response.data.length; i += 1) {
              let totalTime = 0
              for (let d = 1; d < 8; d += 1) {
                totalTime += response.data[i]['Data' + d]
              }
              this.$set(this.scores, parseInt(response.data[i].PilotNo), {
                name: response.data[i].PilotName,
                time: totalTime,
                penalty: response.data[i].Penalty
              })
            }
          })
          // .catch(e => {})
          .finally(() => { this.isLoading = false })
      }
    }
  },
  mounted () {
    console.log(this.pilots)
    if (parseInt(this.$route.params.displayRound) > 0) {
      this.setRoundScores()
    } else {
      alert('implement ful score view')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carousel-control-prev-icon {
 background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23f50' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23f50' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}
</style>
