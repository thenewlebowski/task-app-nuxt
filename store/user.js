// import EventService from '@/services/EventService.js'
// state must return an anonymous function. Otherwise the same state would be shared across ALL requests
export const state = () => ({
  user: null,
  allUsers: [],
  usersNameAndIdKey: {}
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_USERS(state, users) {
    state.allUsers = users.filter(
      (u) => u.username.toUpperCase() !== 'UNASSIGNED'
    )
  },
  CREATE_USERS_NAME_AND_ID_KEY(state, users) {
    const key = {}

    users.forEach((user) => {
      if (user.firstName && user.lastName) {
        key[user._id] = `${user.firstName} ${user.lastName}`
      } else key[user._id] = user.username
    })

    state.usersNameAndIdKey = key
  },
  ADD_USER(state, user) {
    state.user = user
  },
  UPDATE_USER(state, user) {
    state.user = user
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  login() {},
  register({ commit }, data) {
    return this.$axios
      .post('/api/users', data)
      .then((response) => {
        commit('SET_USER', response.data)
        return response.data
      })
      .catch((e) => {
        return e.response
      })
  },
  // update backend and app store
  update({ commit }, data) {
    return this.$axios
      .put('/api/users', data)
      .then((response) => {
        commit('UPDATE_USER', response.data)
        return response
      })
      .catch((e) => {
        return e
      })
  },
  fetchUsers({ commit }) {
    return this.$axios.get('/api/users').then((response) => {
      commit('SET_USERS', response.data)
      commit('CREATE_USERS_NAME_AND_ID_KEY', response.data)
    })
  },
  fetchUser({ commit }, id) {
    return this.$axios.get('/api/users/:id', id).then((response) => {
      commit('SET_USER', response.data)
    })
  }
}

export const getters = {
  getUsers(state) {
    return state.allUsers
  },
  usersNotFetched(state) {
    return state.allUsers.length === 0
  },
  getUsersNameAndIdKey(state) {
    return state.usersNameAndIdKey
  }
}
