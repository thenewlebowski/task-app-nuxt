/**
 * This part of the store will return all
 * of the filterable varieties. You can put
 * anything that you may want to filter by
 * in the future. Such as what we take care
 * of right now, reporter, assignee, site,
 * ect.
 */

export const state = () => ({
  sites: {},
  types: {},
  reporters: {},
  assignees: {},
  priorities: {}
})

export const mutations = {
  async SET_STATE(state, data) {
    // only fetch users if they aren't already set
    if (Object.keys(this.state.user.idKey).length < 1)
      await this.dispatch('user/fetchUsers')
    Object.values(data).map((task) => {
      if (task.site) state.sites[task.site] = task.site
      if (task.type) state.types[task.type] = task.type
      if (task.priority) state.priorities[task.priority] = task.priority
      const assginee = this.state.user.idKey[task.assignee]
      if (task.assignee && assginee) state.assignees[task.assignee] = assginee
      const reporter = this.state.user.idKey[task.reporter]
      if (task.reporter && reporter) state.reporters[task.reporter] = reporter
    })
    return state
  }
}

export const actions = {
  setState({ commit }, data) {
    commit('SET_STATE', data)
  }
}

export const getters = {}
