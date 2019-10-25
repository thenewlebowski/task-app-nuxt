// import EventService from '@/services/EventService.js'
// state must return an anonymous function. Otherwise the same state would be shared across ALL requests
export const state = () => ({
    users: ['Will', 'Noob', 'Death']
})

export const mutations = {
    SET_USERS(state, users) {
        state.users = users
    },
    SET_USER(state, user) {
        state.user = user
    }
}

export const actions = {
    login() {},
    fetchUsers({ commit }) {
        return this.$axios.get('/api/users').then((response) => {
            commit('SET_USERS', response.data)
        })
    },
    fetchUser({ commit }, id) {
        console.log('fetchUser called')
        return this.$axios.get('/api/users/:id', id).then((response) => {
            commit('SET_USER', response.data)
        })
    }
}
