<template>
<div>
<!-- Penalty Modal -->
<div class="modal fade" id="modalPenalty" tabindex="-1" role="dialog" aria-labelledby="addPenalty" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Set penalty points</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modalMessageBody" class="modal-body">
        <div class="md-form mb-5">
          <!-- <input type="text" id="form34" v-model="penalty" pattern = "[0-9]*" placeholder="0" inputmode="numeric" class="form-control validate">-->
          <!-- <input type="text" id="form34" v-model="penalty" pattern = "[0-9]*" placeholder="0" inputmode="numeric" class="form-control validate"> -->
          <select id="form34" v-model="penalty" class="form-control">
            <option>0</option>
            <option>100</option>
            <option>300</option>
          </select>
          <label data-error="wrong" data-success="right" for="form34">Penalty</label>
        </div>
      </div>
      <div class="modal-footer">
                <button type="button" data-dismiss="modal" v-on:click="addPenalty" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>
<!-- Submission confirmation Modal -->
<div class="modal fade" id="modalConfirm" tabindex="-1" role="dialog" aria-labelledby="confirmSubmit" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Confirm Results Submission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modalMessageBody" class="modal-body">
        <div class="md-form mb-5">
<!--        <div class="form-row">
        <template v-for="(time, index) in processedTimes">

            <div class="form-group col-6" :key="time.id">
              <label  :key="time.id"
              v-bind:for="index">Score {{ index + 1 }}, Max: {{ time[1] | secondsToString }}</label>
              <input  :key="time.id" type="text"
              class="form-control"
              v-bind:id="index"
              readonly
              v-bind:value="time[0] | secondsToString" />
            </div>

        </template>
          </div> -->
          <div class="form-row">
            <div class="form-group col align-self-center">
              <label data-error="wrong" data-success="right" for="form34">Total</label>
            </div>
            <div class="form-group col">
            <input type="text" id="form34" v-bind:value="processedTimes.reduce((total, arr) => { return total + arr[0] }, 0) | secondsToString" readonly class="form-control validate">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col align-self-center">
              <label data-error="wrong" data-success="right" for="form35">Dropped</label>
            </div>
            <div class="form-group col align-self-center">
             <!-- Use toFixed here to avoid fp inaccuracies -->
             <input v-if="processedTimes.reduce((total, arr) => { return total + arr[1] }, 0) > 0" type="text" id="form35" v-bind:value="(processedTimes.reduce((total, arr) => { return total + arr[1] }, 0) - processedTimes.reduce((total, arr) => { return total + arr[0] }, 0)).toFixed(1) | secondsToString" readonly disabled class="form-control validate">
             <input v-if="processedTimes.reduce((total, arr) => { return total + arr[1] }, 0) === 0" type="text" id="form35" value="-- : -- : --" readonly disabled class="form-control validate">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col align-self-center">
              <label data-error="wrong" data-success="right" for="form36">Penalty</label>
            </div>
            <div class="form-group col">
            <input type="text" id="form36" v-model="penalty" is-valid readonly disabled class="form-control validate">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-secondary">Cancel</button>
                <button type="button btn-primary" data-dismiss="modal" v-on:click="submitResults" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</div>
<!-- Input Alert Modal -->
<div class="modal fade" id="modalInvalid" tabindex="-1" role="dialog" aria-labelledby="addPenalty" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Input Error</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modalMessageBody" class="modal-body">

      </div>
      <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn btn-primary">Dismiss</button>
      </div>
    </div>
  </div>
</div>

<div class="row mt-2">
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
            placeholder="-----"
            v-bind:id="index"
            pattern = "[0-9]*"
            inputmode="numeric"
            @focus="$event.target.value=''"
            @blur="validateNotEmpty($event)"
            v-bind:value="time[0] | secondsToString"
            v-on:change="validateTime" />
          </div>
        </div>
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
              class="btn btn-block btn-outline-warning py-2"
              v-bind:class="{ 'btn-warning active': rawTimes.length > 0 }"
              :disabled="rawTimes.length === 0"
              data-toggle="modal" data-target="#modalPenalty"

              type="submit">
                Penalty
              </button>
              </div>
            <div class="col-6">
            <button
              class="btn btn-block btn-outline-success py-2"
              v-bind:class="{ 'btn-success active': (rawTimes.length > 0 && $store.state.result.pilotNo !== '0') }"
              v-bind:disabled="rawTimes.length === 0 || $store.state.result.pilotNo === '0' || $store.state.result.pilotNo === 0"
              data-toggle="modal" data-target="#modalConfirm"
              type="submit">
                Submit
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
    return { clicks: 0, penalty: 0, processedTimes: [], errors: [] }
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
    processScores () {
      // console.log('processing scores')
      this.isLoading = true
      axios.post(`/api/comp/${this.id}/round/${this.round}/score`, this.rawTimes)
        .then(response => { this.processedTimes = response.data })
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
        // Set max unless is zero (as it is for poker)
        if (newValue[1] !== 0) {
          newValue[0] = newValue[1] // Set max
          this.processedTimes.splice(parseInt(event.target.id), 1, newValue)
        }
        // console.log(event.target)
      }
    },
    submitResults (state, commit) {
      console.log('in submitResults.submitResults')
      // console.log(this.processedTimes[0])
      const data = { times: this.processedTimes.map((x) => { return x[0] }), penalty: this.penalty }
      // console.log(data)
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
      // console.log('write some code to add penalties!')
      this.penalty = parseInt(this.penalty) ? parseInt(this.penalty) : 0
      // console.log(this.penalty)
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
      // console.log(modal.find('.modal-body'))
      modal.find('.modal-body')[0].innerText = message
      modal.modal()
    },
    validateNotEmpty (event) {
      const inputString = event.target.value
      const processedTimesIndex = parseInt(event.target.id)
      const newValue = this.processedTimes[processedTimesIndex]

      if (inputString === '') {
        this.processedTimes.splice(processedTimesIndex, 1, newValue)
      }
    },
    validateTime (event) {
      // Assume input is a string of digits
      // Assume that we exclude leading zeros and it is min <= 9, secs <=59 (with leading zero) and 0 <= tenths <=9
      let inputString = event.target.value
      const processedTimesIndex = parseInt(event.target.id)
      const newValue = this.processedTimes[processedTimesIndex]

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

      if (realTime > this.processedTimes[processedTimesIndex][1] && this.processedTimes[processedTimesIndex][1] !== 0) {
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
