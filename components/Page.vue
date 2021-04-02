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
    await this.$store.dispatch('boards/fetchBoards')
    await this.$store.dispatch('user/fetchUsers')
    this.boards = this.$store.getters['boards/getBoards']

    this.boards.push({
      title: 'Add Board'
    })
  }
}
</script>
