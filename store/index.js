// export const state = () => ({
// auth: {
//     user: null,
//     loggedIn: false
// }
// })

export const getters = {}

export const mutations = {
  SET_USER(state, authUser) {
    state.authUser = authUser
  }
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const res = await this.$axios.get('/api/auth/user')
    commit('SET_USER', res.data)
  },

  async logout({ commit }) {
    const { data } = await this.$axios.get('/api/auth/logout')
    if (data.ok) commit('SET_USER', null)
  }

  // async handleToken({ commit }, token) {
  //     const res = await this.$axios.post('/api/auth/token', token)
  //     commit('SET_USER', res.data)
  // }
}
