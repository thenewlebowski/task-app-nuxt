import axios from 'axios'
// import Vue from 'vue'

export const state = () => ({
  unfiltered: {},
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
  async SET_BOARDS(state, boards) {
    // await delete state.boards
    // Vue.set(state.boards, null, {})
    await boards.forEach((board) => {
      state.boards[board._id.toString()] = board
    })
    // have a copy of the orignal unfiltered boards
    state.unfiltered = JSON.parse(JSON.stringify(state.boards))
    return state
  },
  SEARCH_BOARDS(state, data) {
    Object.keys(state.unfiltered).map((_id) => {
      const set = state.unfiltered[_id].tasks
      const tasks = {}
      for (const [prop, value] of Object.entries(data)) {
        if (!value) continue
        set.filter((task) => {
          if (
            task[prop.toString()]
              .toUpperCase()
              .includes(value.toString().toUpperCase())
          )
            tasks[task._id] = task
        })
      }
      const payload = {
        board: _id,
        value: Object.values(tasks)
      }

      this.dispatch('boards/updateBoard', payload)
    })
  },
  FILTER_BOARDS(state, data) {
    const boards = JSON.parse(JSON.stringify(state.unfiltered))
    for (const [boardId] of Object.entries(state.unfiltered)) {
      let set = boards[boardId].tasks
      for (const [prop, filter] of Object.entries(data)) {
        if (!filter) continue
        set = set.filter((task) => {
          const property = task[prop.toString()]
          if (
            property &&
            property.toUpperCase() === filter.toString().toUpperCase()
          )
            return true
        })
      }
      const payload = {
        board: boardId,
        value: set
      }
      this.dispatch('boards/updateBoard', payload)
    }
  }
}

export const actions = {
  searchBoards({ commit }, data) {
    commit('SEARCH_BOARDS', data)
  },
  resetFilter({ commit }) {
    commit('SET_BOARDS', Object.values(this.state.boards.unfiltered))
  },
  filterBoards({ commit }, data) {
    commit('FILTER_BOARDS', data)
    return data
  },
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
