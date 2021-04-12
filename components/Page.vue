<template>
  <div class="d-flex flex-row">
    <div v-for="board in Object.values(boards)" :key="board._id">
      <Board :board="board" />
    </div>
    <div>
      <v-card width="360" class="mx-1">
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
import BoardForm from '@/components/board/BoardForm'
import Board from './board/Board'

export default {
  components: {
    Board,
    BoardForm
  },
  data() {
    return { boards: [] }
  },
  computed: {},
  async created() {
    this.unsubscribe = await this.$store.subscribe(async (action, state) => {
      if (action.type === 'boards/SET_BOARDS') {
        const payloadKey = {}
        await action.payload.map((board) => {
          payloadKey[board._id.toString()] = board
        })
        const boards = this.boards
        boards.filter((board) => !payloadKey[board._id.toString()])
        await action.payload.forEach((board) => {
          boards.push(board)
        })
        this.boards = boards
      }
    })
    await this.$store.dispatch('tasks/fetchCurrent')
    await this.$store.dispatch('boards/fetchBoards')
    await this.$store.dispatch('user/fetchUsers')
    this.tasks = this.$store.getters['tasks/getCurrent']
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
