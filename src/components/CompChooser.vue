<template>
<div>

<div v-if="compId !== '' && !isLoading" class="card">
<div class="card-header">
    Active Competition ({{compId}})
  </div>
    <div class="card-body">
    <div class="row">
      <div class="col-8 px-1">
    <h4 class="card-title">{{ selectedComp.CompName}}</h4>
    <p class="card-text"><strong>Venue:</strong> {{selectedComp.CompVenue}}</p>
    <p class="card-text"><strong>Date:</strong> {{ new Date(selectedComp.CompDate).toDateString() }}</p>
      </div>
      <div class="col-4 px-1 align-self-center">
    <button v-on:click="blankCompID" class="btn btn-warning">Change...</button>
    </div>
    </div>
  </div>
  </div>

  <div v-if="compId == ''" class="card">
  <div class="card-header">
    Select active competition...
  </div>
  <div class="card-body">
  <form>
    <div class="form-group">
    <label> Choose competition</label>
    <select for="competition" v-model="$store.state.comp.id" class="ml-2 px-1">
      <option value="" >Choose...</option>
      <option v-for="comp in comps" :key="comp._id" v-bind:value="comp.CompID">{{ comp.CompName }} | {{ new Date(comp.CompDate).toDateString() }}</option>
    </select>
  </div>
    <!-- <button v-on:click="setCompID" class="btn btn-primary">Set Competition</button> -->
    </form>
  </div>
</div>
</div>

</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import axios from 'axios'

const API_URL = '/api/comp'

export default {
  name: 'Competitions',
  data: () => ({
    comps: [],
    isLoading: true
  }),
  computed: {
    selectedComp () {
      return this.comps.filter(comp => comp.CompID === this.compId)[0]
    },
    ...mapState('comp', { compId: 'id' })
  },
  methods: {
    blankCompID (event) {
      this.$store.state.comp.id = ''
    }
  },
  created () {
    this.isLoading = true
    if (Vue.$cookies.isKey('SelectedComp')) {
      this.$store.state.comp.id = Vue.$cookies.get('SelectedComp')
    }
    axios.get(API_URL)
      .then(response => { console.log('CompChooser: created :', response.data); this.comps = response.data })
      // .catch(e => {})
      .finally(() => { this.isLoading = false })

    // fetch(API_URL)
    // .then(response => response.json())
    // .then(result => {
    // this.comps = result
    // this.isLoading = false
    // })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
