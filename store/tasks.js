import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
  // unassignedTasks
  focus: '', // task currently in focus
  unassigned: [], // all unassigned tasks
  assigned: [], // all assigned tasks
  archived: [], // all archived tasks
  index: {}, // all index users tasks
  sites: [
    'Adams&Co',
    'CaseInPoint',
    'Confluence',
    'Connectship',
    'CowboyLiving',
    'CraftDirect',
    'MonkeyWrench',
    'PlumbersStock',
    'Typhoeus',
    'Rayie',
    'SWPlumbing',
    'SupplyExchange',
    'Third Party',
    'Uncategorized',
    'General',
    'IT Task',
    'Marketplace',
    'Wiser',
    'Strikeaprice',
    'TCGM',
    'WIT',
    'Google Express',
    'MowRo',
    'Alarm dot com'
  ] // all sites unique and original
})

export const mutations = {
  SET_TASKS(state, tasks) {
    tasks.map((task) => {
      state.index[task._id.toString()] = task
    })
    this.dispatch('varieties/setState', state.index)
  },
  SET_UNASSIGNED_TASKS(state, tasks) {
    state.unassigned = tasks
  },
  SET_OTHERS_TASKS(state, tasks) {
    state.assigned = tasks
  },
  SET_ARCHIVED_TASKS(state, tasks) {
    state.archived = tasks
  },
  SET_TASK(state, task) {
    state.task = task
  },
  ADD_TASK(state, data) {
    Vue.set(state.index, data.task._id, data.task)
    if (
      data.task.assignee &&
      this.$auth.user._id.toString() === data.task.assignee.toString()
    ) {
      this.dispatch('boards/addTask', data)
        .then((res) => {
          return res
        })
        .catch((err) => {
          return err
        })
    }
  },
  UPDATE_TASK(state, task) {
    if (!state[task.route]) task.route = 'index'
    Vue.set(state[task.route], task._id, task)
    return task
  },
  MOVE_TASK(state, payload) {
    const { value } = payload.tasks
    value.forEach((task) => {
      Vue.set(state.index, task._id, task)
    })
  },
  TAKE_TASK(state, takenTask) {
    state.unassigned = state.unassigned.filter(
      (task) => task._id !== takenTask._id
    )
  },
  ARCHIVE_TASK(state, task) {
    delete state.index[task._id]
    state.archived.push(task)
    this.dispatch('boards/archiveTask', task)
      .then((task) => {
        return task
      })
      .catch((err) => {
        return err
      })
  },
  SET_FOCUS(state, task) {
    Vue.set(state, 'focus', task)
  },
  UNARCHIVE_TASK(state, unarchivedTask) {
    state.archived = state.archived.filter(
      (task) => task._id !== unarchivedTask._id
    )
    if (unarchivedTask.assignee === null) {
      state.unassigned.push(unarchivedTask)
    }
    switch (unarchivedTask.assignee) {
      case null:
        state.unassigned.push(unarchivedTask)
        break
      case this.$auth.user._id:
        const updatedColumn = state.columns[unarchivedTask.status]
        updatedColumn.tasks.push(unarchivedTask)
        Vue.set(state.columns, unarchivedTask.status, updatedColumn)
        break
      default:
        state.assigned.push(unarchivedTask)
    }
  },
  SET_TITLE(state, title) {
    state.title = title
  }
}
export const actions = {
  /**
   * @param {String} id | A string id of the task you wish to recieve
   * @sets {State} focus | Sets the focus to the returned task
   * @mutation {Method} SET_FOCUS | activates the set_focus method
   * @returns {Object} state.focus
   */
  fetchSpecific({ commit }, id) {
    return this.$axios.post(`/api/tasks`, { id }).then((response) => {
      commit('SET_FOCUS', response.data)
    })
  },
  fetchCurrent({ commit }) {
    return axios.get('/api/tasks').then((response) => {
      commit('SET_TASKS', response.data)
    })
  },
  fetchUnassignedTasks({ commit }) {
    return axios.get('/api/tasks/unassigned').then((response) => {
      commit('SET_UNASSIGNED_TASKS', response.data)
    })
  },
  fetchOthersTasks({ commit }) {
    return axios.get('/api/tasks/assigned').then((response) => {
      commit('SET_OTHERS_TASKS', response.data)
    })
  },
  fetchArchivedTasks({ commit }) {
    return axios.get('/api/tasks/archived').then((response) => {
      commit('SET_ARCHIVED_TASKS', response.data)
    })
  },
  addTask({ commit }, task) {
    return axios.post('/api/tasks', task).then(function(response) {
      commit('ADD_TASK', response.data)
      return response
    })
  },
  updateTask({ commit }, payload) {
    const { route } = payload
    return axios.put('/api/tasks', payload).then((response) => {
      const data = response.data
      data.task.route = route
      commit('UPDATE_TASK', data.task)
      if (data.task.board.toString() !== data.oldBoard._id.toString()) {
        this.dispatch('boards/updateTask', response.data)
      }
      return response
    })
  },
  takeTask({ commit }, payload) {
    return axios.put('/api/tasks/take', payload).then((response) => {
      commit('TAKE_TASK', response.data)
    })
  },
  archiveTask({ commit }, taskId) {
    return axios.post('/api/tasks/archive', { taskId }).then((response) => {
      commit('ARCHIVE_TASK', response.data.updated)

      return response
    })
  },
  unarchiveTask({ commit }, taskId) {
    return axios.post('/api/tasks/unarchive', { taskId }).then((response) => {
      commit('UNARCHIVE_TASK', response.data.unarchivedTask)
    })
  }
}
export const getters = {
  getCurrent(state) {
    return state.index
  },
  getTitle(state) {
    return state.title
  },
  getUnassignedTasks(state) {
    return state.unassigned
  },
  getOthersTasks(state) {
    return state.assigned
  },
  getArchivedTasks(state) {
    return state.archived
  },
  getSites(state) {
    return state.sites
  }
}
