<template>
  <div class="custom-container">
    <SearchHeader />
    <Page />
  </div>
</template>

<script>
// import formValidatorMixin from '@/mixins/formValidatorMixin'
import SearchHeader from '@/components/page/SearchHeader'
import Page from '@/components/Page'

// import { defineComponent } from '@vue/composition-api'
import Vue from 'vue'

export default {
  name: 'TasksPage',
  components: {
    Page,
    SearchHeader
  },
  head: () => ({
    title: 'My Tasks'
  }),
  data() {
    return { boards: {} }
  },
  computed: {},
  async created() {
    this.unsubscribe = this.$store.subscribe((action, state) => {
      if (action.type === 'boards/SET_BOARDS') {
        this.updateBoards(action.payload)
      }
    })
    await this.$store.dispatch('tasks/fetchCurrent')
    await this.$store.dispatch('boards/fetchBoards')
    await this.$store.dispatch('user/fetchUsers')
    this.tasks = this.$store.getters['tasks/getCurrent']
  },
  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    updateBoards(payload) {
      payload.forEach((board, i) => {
        Vue.set(this.boards, board._id, board)
      })
    }
  }
}
// export default {

//   mixins: [formValidatorMixin],

// }
</script>

<style scoped>
.custom-container {
  padding: 12px;
  overflow: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
