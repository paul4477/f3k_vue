import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const comp = {
  namespaced: true,
  state: {
    id: '',
    rounds: [],
    pilots: {},
    selectedPilot: null,
    compIsLoaded: false
  },
  watch: {
    compIsLoaded: 'getRoundInfo'
  },
  mutations: {
    SET_ROUNDS (state, payload) {
      console.log('SET_ROUNDS')
      state.rounds = payload
    },
    IS_LOADING (state) {
      state.compIsLoaded = false
    },
    IS_LOADED (state) {
      state.compIsLoaded = true
    },
    CLEAR_ROUND_PILOTS (state, payload) {
      state.pilots = {}
    },
    SET_ROUND_PILOTS (state, payload) {
      console.log('SET_ROUND_PILOTS')
      // Input is a list of all score records for a single round
      // we can assume we will receive calls in order of rounds (I think)
      // { id: {name: '', groups: []} }
      // for record in payload:
      //   if data.haskey(pilotid): data[pilotid].groups.push(record.GroupNo)
      //   else: data[pilotid] = {name: record.PilotName, groups: [record.GroupNo]}
      for (let i = 0; i < payload.length; i += 1) {
        // console.log(payload[i])
        if (payload[i].PilotNo in state.pilots) {
          // console.log('adding to record record', payload[i].PilotNo, state.pilots[payload[i].PilotNo])
          state.pilots[payload[i].PilotNo].groups.push(payload[i].GroupNo)
        } else {
          // console.log('no record', payload[i].PilotNo)
          // state.pilots[payload[i].PilotNo] = { name: payload[i].PilotName, groups: [payload[i].GroupNo] }
          Vue.set(state.pilots, payload[i].PilotNo, { name: payload[i].PilotName, groups: [payload[i].GroupNo] })
        }
      }
    }
  },
  methods: {

  },
  actions: {
    updateCompCookie (context) {
      // console.log('cookie set', context.state.id)
      Vue.$cookies.set('SelectedComp', context.state.id)
    },
    getRoundInfo (context) {
      console.log('updateRoundInfo', context)
      context.commit('IS_LOADING')
      context.dispatch('updateCompCookie')
      axios.get(API_URL + `/comp/${context.state.id}/round/`)
        .then(async response => {
          context.commit('SET_ROUNDS', response.data)
          await context.dispatch('getPilotInfo')
        })
        // .catch(e => {})
        .finally(() => { })

      /* fetch(API_URL + `/comp/${context.state.id}/round/`)
        .then(response => response.json())
        .then(async result => {
          // console.log(result)
          context.commit('SET_ROUNDS', result) // state.shortTaskDescription = result.F3KTaskAbbreviation
          await context.dispatch('getPilotInfo')
          // context.commit('IS_LOADED')
        }) */
      // .then(() => context.commit('IS_LOADED'))
    },
    getPilotInfo (context) {
      console.log('getPilotInfo')
      // fetch(API_URL + `/comp/${this.compId}/round/${this.round}`)
      // if (Object.keys(context.state.pilots).length === 0) {
      // console.log('getPilotInfo2', context)
      context.commit('CLEAR_ROUND_PILOTS')
      for (let i = 1; i <= context.state.rounds.length; i += 1) {
        axios.get(API_URL + `/comp/${context.state.id}/round/${i}/score`)
          .then(response => {
            // context.commit('IS_LOADING')
            context.commit('SET_ROUND_PILOTS', response.data)
          })
          // .catch(e => {})
          .finally(() => { context.commit('IS_LOADED') })

      /*         fetch(API_URL + `/comp/${context.state.id}/round/${i}/score`)
          .then(response => response.json())
          .then(result => {
            // console.log('getPilotInfo3', result)
            context.commit('IS_LOADING')
            context.commit('SET_ROUND_PILOTS', result) // state.shortTaskDescription = result.F3KTaskAbbreviation
          })
          .then(() => context.commit('IS_LOADED')) */
      }
      // }
    }

  }
}

const slot = {
  namespaced: true,
  state: {
    round: '00',
    group: '00',
    // running: true,
    slotState: '',
    canFly: false,
    finishTime: Date(),
    shortTaskDescription: '',
    taskDescription: ''

  },
  getters: {
    compId (state, getters, rootState) {
      // console.log('root', rootState, rootState.comp.id)
      return rootState.comp.id
    }
  },
  actions: {
    updateRoundInfo (context) {
      // console.log('updateRoundInfo', context)
      // fetch(API_URL + `/comp/${this.compId}/round/${this.round}`)
      if (context.getters.compId) {
        axios.get(API_URL + `/comp/${context.getters.compId}/round/${context.state.round}`)
          .then(response => {
            context.commit('SET_TASK_DESC', response.data.F3KTaskDescription)
            context.commit('SET_SHORT_TASK_DESC', response.data.F3KTaskAbbreviation)
          })
          // .catch(e => {})
          .finally(() => { })
      }
    }
  },
  mutations: {
    SET_TASK_DESC (state, payload) {
      // console.log('SET_TASK_DESC', payload)
      state.TaskDescription = payload
    },
    SET_ROUND (state, payload) {
      console.log('SET_ROUND', payload)
      state.round = payload
    },

    SET_SHORT_TASK_DESC (state, payload) {
      // console.log('SET_SHORT_TASK_DESC', payload)
      state.shortTaskDescription = payload
    },
    UPDATE (state, payload) {
      console.log('slot/UPDATE', state.round, payload.round)
      if ((state.round !== payload.round)) {
        state.round = payload.round
        if (payload.round !== '00') {
          store.dispatch('slot/updateRoundInfo')
        }
      }
      state.group = payload.group
      // console.log(payload.endTime)
      state.finishTime = new Date(payload.endTime)
      state.slotState = payload.type
      state.canFly = payload.canFly
    }
  }
}

const result = {
  namespaced: true,
  state: {
    rawTimes: [], // [{ time: <seconds>, valid: true }, ...]
    // In the page not the data processedTimes: [], // [<seconds>, <seconds>...]
    pilotNo: 0,
    round: 0,
    submitted: false, // Set to true when saved
    penalty: 0
  },
  getters: {
    lastTime: state => {
      return state.rawTimes[state.rawTimes.length - 1]
    },
    otherTimes: state => {
      return state.rawTimes.slice(0, state.rawTimes.length - 1)
    },
    currentRound (state, getters, rootState) {
      return rootState.slot.round
    }

  },
  actions: {
    recordTime ({ commit, getters, state }, data) {
      console.log(getters.currentRound, getters.currentRound, state.rawTimes)
      if (state.rawTimes.length === 0) {
        // First result for this round
        commit('SET_ROUND', getters.currentRound)
      }
      commit('RECORD_TIME', data)
    }
  },
  mutations: {
    SET_ROUND (state, payload) {
      state.round = payload
    },
    SET_PILOT (state, payload) {
      state.pilot = payload
    },
    SET_PENALTY (state, payload) {
      state.penalty = payload
    },
    RECORD_TIME (state, payload) {
      state.rawTimes.push(payload) // { time: <seconds>, valid: true }
    },
    CLEAR_TIMES (state, payload) {
      // console.log(payload)
      state.round = 0
      state.submitted = false
      state.penalty = false
      state.rawTimes = []
    },
    TOGGLE_INVALID_LAST (state) {
      state.rawTimes[state.rawTimes.length - 1].valid = !state.rawTimes[state.rawTimes.length - 1].valid
    }
  }
}

const store = new Vuex.Store({
  modules: {
    comp: comp,
    slot: slot,
    result: result
  }
})

const API_URL = '/api'
const events = new EventSource(API_URL + '/events')
events.onmessage = (event) => {
  const parsedData = JSON.parse(event.data)
  store.commit('slot/UPDATE', parsedData)
  // store.commit('slot/UPDATE', parsedData)
  // console.log(parsedData)
}

export default store
