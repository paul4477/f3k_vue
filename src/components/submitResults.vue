<template>
<div>
<!-- Modal -->
<div class="modal fade" id="modalPenalty" tabindex="-1" role="dialog" aria-labelledby="addPenalty" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add penalty</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modalMessageBody" class="modal-body">
        <div class="md-form mb-5">
          <i class="fas fa-user prefix grey-text"></i>
          <input type="text" id="form34" pattern = "[0-9]*" placeholder="0" inputmode="numeric" class="form-control validate">
          <label data-error="wrong" data-success="right" for="form34">Penalty</label>
        </div>
        <div class="md-form">
          <i class="fas fa-pencil prefix grey-text"></i>
          <textarea type="text" id="form8" class="md-textarea form-control" placeholder="Reason penalty was incurred..." rows="4"></textarea>
          <label data-error="wrong" data-success="right" for="form8">Notes</label>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" data-dismiss="modal" v-on:click="addPenalty" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>

<div class="row mt-2">
    <!-- <div class="form-group">
    <label> Choose competition</label>
    <select for="competition" v-model="$store.state.comp.id" class="ml-2 px-1">
      <option value="" >Choose...</option>
      <option v-for="comp in comps" :key="comp._id" v-bind:value="comp.CompID">{{ comp.CompName }} | {{ new Date(comp.CompDate).toDateString() }}</option>
    </select> -->
  <div class="col-7">
    <div class="h5 text-center">Flight Times</div>
    <div class="container-fluid btn-group-vertical p-2 " >
      <button type="button"
        class="btn btn-block btn-primary text-monospace btn-result my-0 py-0"
        v-bind:key="time.id" v-for="time in rawTimes"
        v-bind:class="{ 'btn-danger': !time.valid, 'invalid': !time.valid }">
          {{ time.formattedTime }}
      </button>
    </div>
  </div>

  <div class="col-5">
    <form>

      <template v-for="(time, index) in processedTimes">
        <div class="row mt-2" :key="time.id">
          <div class="form-group-inline" :key="time.id">
            <label  :key="time.id"
            v-bind:for="index">Score {{ index + 1 }}, Max: {{ time[1] | secondsToString }}</label>
          </div>
        </div>
        <div class="row" :key="time.id">
          <div class="col pl-0 mr-2" :key="time.id">
            <input  :key="time.id" type="text"
            class="form-control big-text py-0"
            v-on:click="checkDouble"
            placeholder="00:00.0"
            v-bind:id="index"
            pattern = "[0-9]*"
            inputmode="numeric"
            v-on:focusin="(e) => { e.target.value=''}"
            v-bind:value="time[0] | secondsToString"
            v-on:change="validateTime" />
          </div>
        </div>
        <!--<input type="text" v-model="time[0]" />-->
      </template>

  </form>
  <div v-if="processedTimes.length === 0 && !isLoading" class="alert alert-danger" role="alert">
    No results could be processed. <br />Probably missing round information.
  </div>
  </div>
</div>
<pilotChooser />
<div class="container text-primary text-center">
            <div class="row my-2">
            <div class="col-6">
            <button
              class="btn btn-block btn-outline-success py-2"
              v-on:click="submitResults"
              v-bind:class="{ 'btn-success active': (rawTimes.length > 0 && $store.state.result.pilotNo !== '0') }"
              v-bind:disabled="rawTimes.length === 0 || $store.state.result.pilotNo === '0' || $store.state.result.pilotNo === 0"
              type="submit">
                Submit
              </button>
              </div>
              <div class="col-6">
            <button
              class="btn btn-block btn-outline-warning py-2"
              v-bind:class="{ 'btn-warning active': rawTimes.length > 0 }"
              :disabled="rawTimes.length === 0"
              data-toggle="modal" data-target="#modalPenalty"

              type="submit">
                Add Penalty
              </button>
              </div>

            </div>
            </div>

</div>
</template>

<script>
// import { mapState } from 'vuex'

/* global $ */

import { mapState } from 'vuex'
import axios from 'axios'
import pilotChooser from '@/components/PilotChooser.vue'

export default {
  name: 'submitresults',
  state: {
    isLoading: true
  },
  components: {
    pilotChooser
  },
  data () {
    return { clicks: 0, processedTimes: [], errors: [] }
  },
  computed: {
    ...mapState('result', [
      'rawTimes',
      'round',
      'pilotNo'
    ]),
    ...mapState('comp', [
      'id'
    ])
  },
  created () {
    // console.log(this.$parent)
    // if (this.$parent.actionSubmit === true) {
    // this.$parent.$parent.$on('action-submit-results', () => this.submitResults())
    // this.$parent.actionSubmit = false
    // }
    this.processScores()
  },
  methods: {
    timeUpdated (event) {
      console.log(event)
    },
    processScores () {
      console.log('processing scores')
      this.isLoading = true
      axios.post(`/api/comp/${this.id}/round/${this.round}/score`, this.rawTimes)
        .then(response => { this.processedTimes = response.data; console.log('processed', response.data) })
        .catch(e => {})
        .finally(() => { this.isLoading = false })
    },
    checkDouble (event) {
      if (this.clicks < 1) {
        this.clicks = this.clicks + 1

        setTimeout(() => { this.clicks = 0 }, 500)
      } else {
        // clearTimeout(this.timeoutId)
        this.clicks = 0
        const newValue = this.processedTimes[parseInt(event.target.id)]
        newValue[0] = newValue[1] // Set max
        this.processedTimes.splice(parseInt(event.target.id), 1, newValue)
        // console.log(event.target)
      }
    },
    submitResults (state, commit) {
      console.log('in submitResults.submitResults')
      console.log(this.processedTimes[0])
      const data = this.processedTimes.map((x) => { return x[0] })
      console.log(data)
      axios.put(`/api/comp/${this.id}/round/${this.round}/score/${this.pilotNo}`, data)
        .then(response => { console.log('submitted', response.data) })
        .catch(e => {})
        .finally(() => {
          this.isLoading = false
          const resultsRound = this.round // This is reset by clearing times
          this.$store.commit('result/CLEAR_TIMES')
          this.$router.push({ path: `results/${resultsRound}` })
        })
      // if (!this.running) {
      // this.$store.commit('result/CLEAR_TIMES')
      // }
    },
    addPenalty (state, commit) {
      console.log('write some code to add penalties!')
    },
    formatTime (time, showTenths = false) {
      function pad0 (value, count) {
        var result = value.toString()
        for (; result.length < count; --count) {
          result = '0' + result
        }
        return result
      }
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      const fraction = (time * 10) % 10
      if (showTenths) {
        return `${pad0(minutes, 2)}:${pad0(seconds, 2)}.${Math.floor(fraction)}`
      } else { return `${pad0(minutes, 2)}:${pad0(seconds, 2)}` }
    },
    modalAlert (message) {
      const modal = $('#modalInvalid')
      console.log(modal.find('.modal-body'))
      modal.find('.modal-body')[0].innerText = message
      modal.modal()
    },
    validateTime (event) {
      // Assume input is a string of digits
      // Assume that we exclude leading zeros and it is min <= 9, secs <=59 (with leading zero) and 0 <= tenths <=9

      let inputString = event.target.value
      const processedTimesIndex = parseInt(event.target.id)
      const newValue = this.processedTimes[processedTimesIndex]

      if (inputString === '') {
        console.log('no input')
        this.processedTimes.splice(processedTimesIndex, 1, newValue)
      }

      if (inputString.length > 5) {
        this.modalAlert('Input string is too long.')
        this.processedTimes.splice(processedTimesIndex, 1, newValue)
        return
      }
      const isnum = /^\d+$/.test(inputString)
      if (!isnum) {
        this.modalAlert('Only use digits for input.')
        this.processedTimes.splice(processedTimesIndex, 1, newValue)

        // this.processedTimes.splice(processedTimesIndex, 1, newValue)
        return
      };
      const tenths = inputString.slice(-1)

      let mins = '00'
      let secs = '00'
      inputString = inputString.slice(0, -1)
      // console.log("0:", inputString, mins, secs, tenths);
      if (inputString.length === 1) {
        secs = '0' + inputString.slice(-1)
        mins = '00'
        // inputString = inputString.slice(0,-2)
        // console.log("1:", inputString, mins, secs, tenths)
      } else if (inputString.length > 1) {
        secs = inputString.slice(-2)
        if (parseInt(secs) > 59) {
          this.modalAlert('Value for second must be < 60.')
          this.processedTimes.splice(processedTimesIndex, 1, newValue)
          return
        }
        inputString = inputString.slice(0, -2)
        //  console.log("2:", inputString, mins, secs, tenths);
        if (inputString.length === 1) {
          mins = '0' + inputString
          // console.log("3:", inputString, mins, secs, tenths);
        } else if (inputString.length > 1) {
          mins = inputString
          if (parseInt(mins) > 9) {
            this.modalAlert('That seems like too many minutes.')
            this.processedTimes.splice(processedTimesIndex, 1, newValue)
            return
          }
        } else {
          mins = '00'
          // console.log("4:", inputString, mins, secs, tenths);
        }
      }
      const realTime = (parseInt(mins) * 60) + parseInt(secs) + (parseInt(tenths) / 10)

      if (realTime > this.processedTimes[processedTimesIndex][1]) {
        this.modalAlert('Time entered exceeds the maximum.')
        this.processedTimes.splice(processedTimesIndex, 1, newValue)
        return
      };
      newValue[0] = realTime
      this.processedTimes.splice(processedTimesIndex, 1, newValue)
      // console.log(this.processedTimes)

      // console.log('scoreData was: ', scoreData)
      // scoreData[event.target.scoreIndex] = realTime
      // event.target.value = `${mins}:${secs}.${tenths}`
      // console.log('scoreData is now: ', scoreData)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.big-text {
  font-size: 2rem
}
</style>
