<template>
  <div>
    <SearchHeader />
    <Page :board-form="false" :boards="reported" />
    <Redirect
      v-if="!loading"
      :cont-style="{
        position: 'fixed',
        bottom: '60px',
        right: '20px',
        width: '100px',
        height: '100px'
      }"
      :btn-style="{
        height: '100%',
        width: '100%'
      }"
      :chip-style="{ position: 'absolute', top: '-185%', right: '-30%' }"
      url="/"
      tooltip="Go to your assigned tasks"
    />
  </div>
</template>
<script>
import SearchHeader from '@/components/page/SearchHeader'
import Redirect from '@/components/buttons/Redirect'
import Page from '@/components/Page'
import Vue from 'vue'

export default {
  name: 'ReportedPage',
  components: {
    SearchHeader,
    Redirect,
    Page
  },
  data() {
    return { loading: true, reported: {} }
  },
  computed: {
    // reportedBoard() {
    //   Object.values(this.reported).map((task) => {})
    // }
  },
  async created() {
    this.unsubscribe = this.$store.subscribe((action, state) => {
      if (action.type === 'boards/SET_BOARDS') {
        this.updateBoards(action.payload)
      }
    })
    // await this.$store.dispatch('tasks/fetchReported')
    await this.$store.dispatch('boards/fetchReported')
    await this.$store.dispatch('user/fetchUsers')
    this.tasks = this.$store.getters['tasks/getCurrent']
    this.loading = false
  },
  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    updateBoards(payload) {
      payload.forEach((board, i) => {
        Vue.set(this.reported, board._id, board)
      })
    }
  }
}

// export default reported({
//   setup() {}
// })
//
</script>
