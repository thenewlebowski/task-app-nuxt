<template>
  <div>
    <!-- <SearchHeader /> -->
    <div class="d-flex flex-row my-3">
      <draggable v-bind="dragOptions" v-model="drag" class="d-flex">
        <div
          v-for="board in Object.values(boards).sort(
            (a, b) => a.index - b.index
          )"
          :key="board._id"
        >
          <Board :id="board._id" />
        </div>
      </draggable>
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
import draggable from 'vuedraggable'

import BoardForm from '@/components/board/BoardForm'
import SearchHeader from '@/components/page/SearchHeader'
import Board from './board/Board'

export default {
  components: {
    Board,
    BoardForm,
    draggable,

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
    drag: {
      get() {
        return Object.values(this.boards).sort((a, b) => a.index - b.index)
      },
      set(v) {
        // hack because searching will cause the showing task to over rider
        // in the future you could filter out this task from the unfiltered state
        // of the old board and push it to the unfilter state fo the new board
        if (this.$store.state.boards.search) return this.showMoveError()
        v = JSON.parse(JSON.stringify(v))
        console.log(v)
        v.map((board, i) => {
          const payload = {
            index: i,
            board: board._id
          }
          this.$store.dispatch('boards/updateBoard', payload)
        })
      }
    },
    dragOptions() {
      return {
        delay: 200,
        animation: 200,
        group: 'description',
        ghostClass: 'ghost',
        scrollSensitivity: 200,
        scrollSpeed: 25,
        forceFallback: true,
        delayOnTouchOnly: true,

        disabled: !(this.$route.name === 'index' || this.$auth.user.admin)
      }
    },
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
  },
  notifications: {
    showMoveError: {
      title: 'Failed',
      message:
        'Cannot move tasks while searching, you may update the tasks board in the task form',
      type: 'error'
    }
  }
}
</script>
<style scoped>
.drag-board {
  cursor: move;
}

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
