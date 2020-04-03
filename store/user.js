// import EventService from '@/services/EventService.js'
// state must return an anonymous function. Otherwise the same state would be shared across ALL requests
export const state = () => ({ user: null, allUsers: [], usersNameKey: {} })

export const mutations = {
    SET_USER(state, user) {
        state.user = user
    },
    SET_USERS(state, users) {
        state.allUsers = users
    },
    CREATE_USERS_NAME_KEY(state, users) {
        const key = {}

        users.forEach((user) => {
            key[user._id] = `${user.firstName} ${user.lastName}`
        })

        state.usersNameKey = key
        console.log('state.usersNameKey', key)
    },
    ADD_USER(state, user) {
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
    fetchUsers({ commit }) {
        return this.$axios.get('/api/users').then((response) => {
            commit('SET_USERS', response.data)
            commit('CREATE_USERS_NAME_KEY', response.data)
        })
    },
    fetchUser({ commit }, id) {
        return this.$axios.get('/api/users/:id', id).then((response) => {
            commit('SET_USER', response.data)
        })
    }
}

export const getters = {
    usersNotFetched(state) {
        return state.allUsers.length === 0
    }
}
