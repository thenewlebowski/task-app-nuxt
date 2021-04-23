<template>
  <div>
    <!-- <SearchHeader /> -->
    <div class="d-flex flex-row my-3">
      <div v-for="board in boards" :key="board._id">
        <Board :board="board" />
      </div>
      <div v-if="showAddBoardForm">
        <v-card width="360" class="mx-1">
          <v-app-bar color="#2F929D">
            <v-toolbar-title v-text="'Add New Board'" />
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
  </div>
</template>

<script>
import Vue from 'vue'
import BoardForm from '@/components/board/BoardForm'
import SearchHeader from '@/components/page/SearchHeader'
import Board from './board/Board'

export default {
  components: {
    Board,
    BoardForm,
    SearchHeader
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
  computed: {
    // computes whether or not to display the add board form
    showAddBoardForm() {
      return this.$route.name === 'index' && !this.loading
    }
  },
  created() {
    this.unsubscribe = this.$store.subscribe((action, state) => {
      if (action.type === 'boards/SET_BOARDS') {
        this.updateBoards(action.payload)
      }
      this.loading = false
    })
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
.custom-container {
  position: absolute;
  /* width: max-content; */
  left: 0;
}
.page-header {
  display: inline;
  width: max-content;
  position: sticky;
  left: 0;
}
.add-board {
  cursor: pointer;
  height: 100px;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
