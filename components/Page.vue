<template>
  <div class="d-flex flex-row">
    <div v-for="board in boards" :key="board._id">
      <Board :board="board" />
    </div>
  </div>
</template>

<script>
import Board from './board/Board'

export default {
  components: {
    Board
  },
  data: () => ({
    boards: []
  }),
  async created() {
    await this.$store.dispatch('tasks/fetchCurrent')
    await this.$store.dispatch('boards/fetchBoards')
    await this.$store.dispatch('user/fetchUsers')
    this.boards = this.$store.getters['boards/getBoards']
    this.tasks = this.$store.getters['tasks/getCurrent']

    this.boards.push({
      title: 'Add Board'
    })
  }
}
</script>
