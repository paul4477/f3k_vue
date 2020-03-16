<template>
<transition name="fade">
  <div v-if="compId !== '' && selectedComp && compIsLoaded && !isLoading" id="carouselExampleControls" class="carousel slide" data-interval="false" data-ride="carousel">
  <div class="carousel-inner" >
    <div v-for="(round, index) in rounds" :key=round.RoundNo class="carousel-item px-5" :class="{
      'active': parseInt(currentRound) === 0 ? (
        (index === 0) ? true : false
        ) : index + 1 === parseInt(currentRound)
      }">

      <table class="table table-sm table-striped" v-bind:class="{'table-dark': index + 1 < parseInt(currentRound)}">
        <thead class="thead-dark">
          <tr>
            <th scope="col" >Round</th>
            <th scope="col">{{ round.RoundNo }}</th>
          </tr>
          <tr>
            <th scope="row" >Task</th>
            <th scope="col" >{{ round.F3KTaskAbbreviation }}</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="pilot in pilots" :key=pilot._id>
            <th scope="row">{{ pilot.name }}</th>
            <td scope="col" >{{ pilot.groups[index] }}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
  </div>

<!--<table v-if="compId !== '' && selectedComp" class="table table-responsive table-striped">
  <thead class="thead-dark">
    <tr>
      <th scope="col" >Round</th>
      <th scope="col" v-for="round in rounds" :key=round._id>{{ round.RoundNo }}</th>
    </tr>
    <tr>
      <th scope="row" >Task</th>
      <th scope="col" v-for="round in rounds" :key=round._id>{{ round.F3KTask }}</th>
    </tr>
  </thead>
  <tbody>

    <tr v-for="pilot in pilots" :key=pilot._id>
      <th scope="row">{{ pilot.name }}</th>
      <th scope="col" v-for="group in pilot.groups" :key=group._id>{{ group }}</th>
    </tr>
  </tbody>
</table>-->
</transition>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
const API_URL = '/api/comp'

/* global enableScroll */
enableScroll()

export default {
  name: 'CompDisplaySlideAll',
  data: () => ({
    isLoading: false,
    comps: []
  }),
  computed: {
    selectedComp () {
      console.log('rounds:', this.rounds.length)
      // if (this.rounds.length === 0) this.$store.dispatch('comp/getRoundInfo')
      return this.comps.filter(comp => comp.CompID === this.compId)[0]
    },
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
    compId: 'updateRounds'
  },
  methods: {
    blankCompID (event) {
      this.$store.state.comp.id = ''
    },
    updateRounds () {
      console.log('watcher triggered')
      this.$store.dispatch('comp/getRoundInfo')
    }
  },
  mounted () {
    this.isLoading = true
    axios.get(API_URL)
      .then(response => { console.log('CompDisplaySlideAll: created:', response.data); this.comps = response.data })
      // .catch(e => {})
      .finally(() => {
        this.isLoading = false
        if (this.compId) {
          this.$store.dispatch('comp/getRoundInfo')
        }
      })
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
