import axios from 'axios'

export const state = () => ({
  boards: {}
})

export const mutations = {
  // creates object that we can refer to for department _ids
  SET_BOARDS(state, boards) {
    state.boards = boards
  }
}

export const actions = {
  fetchBoards({ commit }) {
    const _id = this.$auth.user._id
    console.log(_id)
    return axios.get('api/boards', { _id }).then((res) => {
      console.log(res.data)
      commit('SET_BOARDS', res.data)
    })
  },

  createBoard({ commit }, data) {
    return axios.post('api/boards', data).then((res) => {
      commit('SET_BOARDS', res.data)
    })
  }
}

export const getters = {
  getBoards(state) {
    return state.boards
  }
}
