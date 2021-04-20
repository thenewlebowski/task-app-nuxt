<template>
  <div class="d-flex flex-row">
    <div v-for="board in boards" :key="board._id">
      <Board :board="board" />
    </div>
    <div>
      <v-card v-if="!loading" width="360" class="mx-1">
        <v-app-bar color="blue-grey">
          <v-toolbar-title v-text="'Add New Board'" />
          <v-chip class="ma-2" color="green" text-color="white">New</v-chip>
          <div class="flex-grow-1"></div>
        </v-app-bar>
        <v-container>
          <li class="add-board">
            <BoardForm />
          </li>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BoardForm from '@/components/board/BoardForm'
import Board from './board/Board'

export default {
  components: {
    Board,
    BoardForm
  },
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return { boards: {}, loading: true }
  },
  computed: {},
  async created() {
    this.unsubscribe = this.$store.subscribe((action, state) => {
      if (action.type === 'boards/SET_BOARDS') {
        this.updateBoards(action.payload)
      }
    })
    await this.$store.dispatch('tasks/fetchCurrent')
    await this.$store.dispatch('boards/fetchBoards', this.userId)
    await this.$store.dispatch('user/fetchUsers')
    this.loading = false
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
</script>
<style scoped>
.add-board {
  cursor: pointer;
  height: 100px;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
