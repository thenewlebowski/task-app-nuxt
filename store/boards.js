import axios from 'axios'

export const state = () => ({
  boards: {},
  boardKey: {}
})

export const mutations = {
  // adds single task
  ADD_TASK(state, data) {
    state.boards[data.task.board].tasks.push(data.task)
    return state
  },
  // removes single task
  REMOVE_TASK(state, data) {
    const oldBoardId = data.oldBoard._id.toString()
    state.boards[oldBoardId].tasks = state.boards[oldBoardId].tasks.filter(
      (t) => t._id.toString() !== data.task._id.toString()
    )
    return state
  },
  // updates entire tasks array
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
    boards.forEach((board) => {
      state.boards[board._id.toString()] = board
    })
    return state
  }
}

export const actions = {
  updateTask({ commit }, data) {
    commit('REMOVE_TASK', data)
    commit('ADD_TASK', data)
    return data
  },
  addTask({ commit }, data) {
    commit('ADD_TASK', data)
    return data
  },
  archiveTask({ commit }, data) {
    const board = this.state.boards.boards[data.board]
    board.tasks = board.tasks.filter(
      (t) => t._id.toString() !== data._id.toString()
    )
    commit('SET_BOARDS', [board])
    return data
  },
  updateBoard({ commit }, data) {
    commit('UPDATE_BOARD', data)
    return data
  },
  fetchBoards({ commit }, _id = null) {
    _id = _id || this.$auth.user._id
    return axios
      .post('/api/boards', { _id })
      .then((res) => {
        commit('SET_BOARDS', res.data)
        commit('SET_BOARD_KEY', res.data)
      })
      .catch((err) => {
        return err
      })
  },

  createBoard({ commit }, data) {
    return axios
      .post('/api/boards/create', data)
      .then((res) => {
        commit('SET_BOARDS', [res.data])
        return res
      })
      .catch((err) => {
        return err
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
