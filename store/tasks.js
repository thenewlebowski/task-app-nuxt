import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
  columns: {},
  unassignedTasks: [],
  othersTasks: [],
  archivedTasks: [],
  title: ''
})

export const mutations = {
  SET_TASKS(state, tasks) {
    const columnsObj = {}
    let columnKey = 0

    tasks.forEach((task) => {
      const columnName = task.status

      if (columnsObj.hasOwnProperty(task.status)) {
        columnsObj[columnName].tasks.push(task)
      } else {
        columnsObj[columnName] = {
          key: columnKey,
          title: columnName,
          tasks: []
        }
        columnKey++
      }
    })
    // puts the tasks in order by their 'index' value
    Object.keys(columnsObj).forEach((columnTitle) => {
      columnsObj[columnTitle].tasks.sort((a, b) => a.index > b.index)
    })

    state.columns = columnsObj
  },
  SET_UNASSIGNED_TASKS(state, tasks) {
    state.unassignedTasks = tasks
  },
  SET_OTHERS_TASKS(state, tasks) {
    state.othersTasks = tasks
  },
  SET_ARCHIVED_TASKS(state, tasks) {
    state.archivedTasks = tasks
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
      state.unassignedTasks.push(task)
    }
  },
  UPDATE_TASK(state, taskToEdit) {
    if (taskToEdit.assignee === this.$auth.user._id) {
      const column = state.columns[taskToEdit.status]
      column.tasks = column.tasks.map((task) => {
        if (task._id === taskToEdit._id) {
          return taskToEdit
        } else {
          return task
        }
      })

      Vue.set(state.columns, taskToEdit.status, column)
    } else {
      state.unassignedTasks = state.unassignedTasks.map((task) => {
        if (task._id === taskToEdit._id) {
          return taskToEdit
        } else {
          return task
        }
      })
    }
  },
  MOVE_TASK(state, payload) {
    const { fromColName, fromColumnTasks, toColName, toColumnTasks } = payload

    Vue.set(state.columns[fromColName], 'tasks', fromColumnTasks)
    Vue.set(state.columns[toColName], 'tasks', toColumnTasks)
  },
  TAKE_TASK(state, takenTask) {
    const toColName = takenTask.status
    const tasks = state.columns[toColName].tasks
    tasks.push(takenTask)

    Vue.set(state.columns[toColName], 'tasks', tasks)

    state.unassignedTasks = state.unassignedTasks.filter(
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

    state.unassignedTasks.forEach((task, i) => {
      if (task._id === archivedTask._id) {
        state.unassignedTasks.splice(i, 1)
      }
    })
  },
  UNARCHIVE_TASK(state, unarchivedTask) {
    state.archivedTasks = state.archivedTasks.filter(
      (task) => task._id !== unarchivedTask._id
    )
    if (unarchivedTask.assignee === null) {
      state.unassignedTasks.push(unarchivedTask)
    }
    switch (unarchivedTask.assignee) {
      case null:
        state.unassignedTasks.push(unarchivedTask)
        break
      case this.$auth.user._id:
        const updatedColumn = state.columns[unarchivedTask.status]
        updatedColumn.tasks.push(unarchivedTask)
        Vue.set(state.columns, unarchivedTask.status, updatedColumn)
        break
      default:
        state.othersTasks.push(unarchivedTask)
    }
  },
  SET_TITLE(state, title) {
    state.title = title
  }
}
export const actions = {
  fetchTasks({ commit }) {
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
    return axios.get('api/tasks/others').then((response) => {
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
    })
  },
  updateTask({ commit }, payload) {
    return axios.put('api/tasks', payload).then((response) => {
      commit('UPDATE_TASK', response.data.updatedTask)
    })
  },
  moveTask({ commit }, payload) {
    return axios.put('api/tasks/move', payload).then((response) => {
      commit('MOVE_TASK', response.data)
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
  getColumns(state) {
    return state.columns
  },
  getTitle(state) {
    return state.title
  },
  getUnassignedTasks(state) {
    return state.unassignedTasks
  },
  getOthersTasks(state) {
    return state.othersTasks
  },
  getArchivedTasks(state) {
    return state.archivedTasks
  }
}
