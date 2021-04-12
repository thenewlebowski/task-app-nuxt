import axios from 'axios'

export const state = () => ({
  boards: {},
  boardKey: {}
})

export const mutations = {
  UPDATE_BOARD(state, data) {
    state.boards[data.board].tasks = data.value
  },
  SET_BOARD_KEY(state, boards) {
    const key = {}
    boards.map((board) => (key[board._id] = board.title))
    return (state.boardKey = key)
  },
  // creates object that we can refer to for department _ids
  SET_BOARDS(state, boards) {
    return boards.forEach((board) => {
      state.boards[board._id] = board
    })
  }
}

export const actions = {
  updateBoard({ commit }, data) {
    commit('UPDATE_BOARD', data)
    return data
  },
  fetchBoards({ commit }) {
    const _id = this.$auth.user._id
    return axios.get('api/boards', { _id }).then((res) => {
      commit('SET_BOARDS', res.data)
      commit('SET_BOARD_KEY', res.data)
    })
  },

  createBoard({ commit }, data) {
    return axios.post('api/boards', data).then((res) => {
      commit('SET_BOARDS', [res.data])
    })
  }
}

export const getters = {
  getBoardKey(state) {
    return state.boardKey
  },
  getBoards(state) {
    return state.boards
  }
}
