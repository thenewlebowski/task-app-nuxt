import axios from 'axios'

export const state = () => ({
  departments: {}
})

export const mutations = {
  // creates object that we can refer to for department _ids
  SET_DEPARTMENTS(state, departments) {
    departments.forEach((department) => {
      state.departments[department._id] = department.title
    })
  }
}

export const actions = {
  fetchDepartments({ commit }) {
    return axios.get('api/departments').then((response) => {
      commit('SET_DEPARTMENTS', response.data)
    })
  }
}

export const getters = {
  getDepartments(state) {
    return state.departments
  }
}
