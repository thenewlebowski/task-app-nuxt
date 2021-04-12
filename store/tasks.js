import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
  // unassignedTasks
  unassigned: [], // all unassigned tasks
  assigned: [], // all assigned tasks
  archived: [], // all archived tasks
  index: [] // all index users tasks
})

export const mutations = {
  SET_TASKS(state, tasks) {
    state.index = tasks
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
  ADD_TASK(state, task) {
    if (task.assignee === this.$auth.user._id) {
      const column = state.columns[task.status]
      column.tasks.push(task)

      Vue.set(state.columns, task.status, column)
    } else {
      state.unassigned.push(task)
    }
  },
  UPDATE_TASK(state, task) {
    state[task.route] = state[task.route].filter(
      (old) => old._id.toString() !== task._id.toString()
    )
    state[task.route].push(task)
    return task
  },
  async MOVE_TASK(state, payload) {
    const { value } = payload.tasks
    const payloadKey = {}
    const route = state[payload.route]
    await value.forEach((task) => {
      payloadKey[task._id] = task
    })
    state[payload.route] = await route.filter((task) => {
      return !payload[task._id]
    })
    value.forEach((task) => {
      state[payload.route].push(task)
    })
    return payload
  },
  TAKE_TASK(state, takenTask) {
    const toColName = takenTask.status
    const tasks = state.columns[toColName].tasks
    tasks.push(takenTask)

    Vue.set(state.columns[toColName], 'tasks', tasks)

    state.unassigned = state.unassigned.filter(
      (task) => task._id !== takenTask._id
    )
  },
  ARCHIVE_TASK(state, archivedTask) {
    Object.values(state.columns).forEach((column) => {
      column.tasks.forEach((task, i) => {
        if (task._id === archivedTask._id) {
          column.tasks.splice(i, 1)
          Vue.set(state.columns, task.status, column)
        }
      })
    })

    state.unassigned.forEach((task, i) => {
      if (task._id === archivedTask._id) {
        state.unassigned.splice(i, 1)
      }
    })
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
  fetchCurrent({ commit }) {
    return axios.get('api/tasks').then((response) => {
      commit('SET_TASKS', response.data)
    })
  },
  fetchUnassignedTasks({ commit }) {
    return axios.get('api/tasks/unassigned').then((response) => {
      commit('SET_UNASSIGNED_TASKS', response.data)
    })
  },
  fetchOthersTasks({ commit }) {
    return axios.get('api/tasks/assigned').then((response) => {
      commit('SET_OTHERS_TASKS', response.data)
    })
  },
  fetchArchivedTasks({ commit }) {
    return axios.get('api/tasks/archived').then((response) => {
      commit('SET_ARCHIVED_TASKS', response.data)
    })
  },
  // fetchTask({ commit }, id) {
  //     return axios.get('api/tasks/:id', id).then((response) => {
  //         commit('SET_TASK', response.data)
  //     })
  // },
  addTask({ commit }, task) {
    return axios.post('api/tasks', task).then((response) => {
      commit('ADD_TASK', response.data.newTask)
      return response
    })
  },
  updateTask({ commit }, payload) {
    const { route } = payload
    return axios.put('api/tasks', payload).then((response) => {
      const task = response.data.updatedTask
      task.route = route
      commit('UPDATE_TASK', task)
      return response
    })
  },
  moveTask({ commit }, payload) {
    return axios.put('api/tasks/move', payload).then((response) => {
      const { route } = payload
      const data = response.data
      data.route = route
      commit('MOVE_TASK', data)
      return response
    })
  },
  takeTask({ commit }, task) {
    return axios.put('api/tasks/take', { task }).then((response) => {
      commit('TAKE_TASK', response.data)
    })
  },
  archiveTask({ commit }, taskId) {
    return axios.post('api/tasks/archive', { taskId }).then((response) => {
      commit('ARCHIVE_TASK', response.data.archivedTask)
    })
  },
  unarchiveTask({ commit }, taskId) {
    return axios.post('api/tasks/unarchive', { taskId }).then((response) => {
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
  }
}
