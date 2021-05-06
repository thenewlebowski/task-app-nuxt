<template>
  <div class="custom-container">
    <SearchHeader v-if="!loading" />
    <Page />
    <Redirect
      v-if="!loading"
      url="/reported"
      chip-color="success"
      icon="mdi-file-chart"
      tooltip="Checkout on your reported tasks"
    />
  </div>
</template>

<script>
// import formValidatorMixin from '@/mixins/formValidatorMixin'
import SearchHeader from '@/components/page/SearchHeader'
import Page from '@/components/Page'

// import { defineComponent } from '@vue/composition-api'
import Redirect from '@/components/buttons/Redirect'
import Vue from 'vue'

export default {
  name: 'TasksPage',
  components: {
    Page,
    Redirect,
    SearchHeader
  },
  head: () => ({
    title: 'My Tasks'
  }),
  data() {
    return { boards: {}, loading: true }
  },
  computed: {},
  async mounted() {
    this.unsubscribe = this.$store.subscribe((action, state) => {
      if (action.type === 'boards/SET_BOARDS') {
        this.updateBoards(action.payload)
      }
    })
    await this.$store.dispatch('tasks/fetchCurrent')
    await this.$store.dispatch('boards/fetchBoards')
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
