import Vue from 'vue'

export const state = () => ({
  // unfiltered: {}, //don't know this can't be declared when store is build why but for some reason vuex throws errors when it is :shrug:
  boards: {},
  boardKey: {},
  search: false
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
    Object.entries(data).map(([key, value]) => {
      Vue.set(state.boards[data.board], key, value)
    })
    // update tasks board to match board
    const payload = {
      color: state.boards[data.board].color,
      title: state.boards[data.board].title,
      _id: data.board
    }
    const temp = state.boards[data.board].tasks.map((t) => {
      t.board = payload
      return t
    })
    Vue.set(state.boards[data.board], 'tasks', temp)
    Vue.set(state.unfiltered, data.board, data)
  },
  // resets boards to a blank object
  RESET_BOARDS(state) {
    state.boards = Object()
    return state
  },
  SET_BOARD_KEY(state, boards) {
    const key = {}
    boards.map((board) => (key[board._id.toString()] = board.title))
    return (state.boardKey = key)
  },
  // creates object that we can refer to for department _ids
  async SET_BOARDS(state, boards) {
    state.search = false
    // await delete state.boards
    await boards.forEach((board) => {
      Vue.set(state.boards, [board._id.toString()], board)
    })
    // have a copy of the orignal unfiltered boards
    const data = JSON.parse(JSON.stringify(state.boards))
    state.unfiltered = { ...data }
    return state
  },
  SEARCH_BOARDS(state, data) {
    Vue.set(state, 'search', true)
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

      Vue.set(state.boards[_id], 'tasks', Object.values(tasks))
    })
  },
  FILTER_BOARDS(state, data) {
    Vue.set(state, 'search', true)
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

      Vue.set(state.boards[boardId], 'tasks', set)
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
  fetchReported({ commit }) {
    this.$axios
      .get('/api/boards/reported')
      .then(async (res) => {
        if (Object.keys(this.state.user.idKey).length < 1)
          await this.dispatch('user/fetchUsers')
        const data = await res.data.map((board) => {
          const user = this.state.user.idKey[board._id.toString()]
          board.title = user ? user.username : 'Unassigned'
          return board
        })
        commit('RESET_BOARDS')
        commit('SET_BOARDS', data)
      })
      .catch((err) => err)
  },
  addTask({ commit }, data) {
    commit('ADD_TASK', data)
    return data
  },
  archiveTask({ commit }, data) {
    const payload = {
      task: data,
      oldBoard: { _id: data.board }
    }
    commit('REMOVE_TASK', payload)
    return data
  },
  updateBoard({ commit }, data) {
    if (!data.board) data.board = data._id
    const payload = { update: data }
    return this.$axios
      .put('/api/boards/', payload)
      .then((res) => {
        commit('UPDATE_BOARD', data)
        return res
      })
      .catch((err) => {
        return err
      })
  },
  fetchBoards({ commit }, _id = null) {
    _id = _id || this.$auth.user._id
    return this.$axios
      .post('/api/boards', { _id })
      .then((res) => {
        commit('RESET_BOARDS')
        commit('SET_BOARDS', res.data)
        commit('SET_BOARD_KEY', res.data)
      })
      .catch((err) => {
        return err
      })
  },

  createBoard({ commit }, data) {
    return this.$axios
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
