<template>
  <v-card width="360" class="mx-1">
    <v-app-bar color="#2F929D">
      <!-- <v-btn icon>
        <v-icon>mdi-settings</v-icon>
      </v-btn> -->
      <v-toolbar-title :board="board" v-text="board.title" />
      <div class="flex-grow-1"></div>
      <div
        v-if="board.color"
        v-bind:style="{ backgroundColor: board.color }"
        @mouseover="hover = true"
        @mouseleave="hover = false"
        class="board-color"
      >
        <v-icon class="mdi-pencil">
          mdi-pencil
        </v-icon>
      </div>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
          <div v-if="board.title !== 'Add Board'">
            <draggable
              v-model="tasks"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
              class="list-group pl-0"
              group="tasks"
              tag="ul"
            >
              <li v-for="task in tasks" :key="task.id" class="list-group-item">
                <TaskCard
                  :id="task._id"
                  :task="$store.state.tasks.index[task._id]"
                />
              </li>
            </draggable>
          </div>
          <div v-else>
            <li class="add-board">
              <BoardForm />
            </li>
          </div>
        </v-col>
      </v-row>
      <TaskForm />
    </v-container>
  </v-card>
</template>

<script>
import draggable from 'vuedraggable'
import TaskCard from '@/components/task/TaskCard'
import TaskForm from '@/components/task/TaskForm'
import BoardForm from '@/components/board/BoardForm'

export default {
  components: {
    draggable,
    BoardForm,
    TaskForm,
    TaskCard
  },
  props: {
    // board id
    id: {
      type: String,
      required: true
    }
  },
  data: () => ({
    hover: false,
    drag: false
  }),
  computed: {
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
    board: {
      get() {
        console.log(this.$store.state.boards.boards[this.id.toString()])
        return this.$store.state.boards.boards[this.id.toString()]
      },
      set(value, evt) {
        console.log('[Board.vue] Board setter')
        console.log(value)
        console.log(evt)
      }
    },
    tasks: {
      get() {
        return this.$store.state.boards.boards[this.id.toString()].tasks
      },
      set(tasks) {
        const payload = {
          tasks,
          board: this.board._id
        }

        this.$store.dispatch('boards/updateBoard', payload)
      }
    }
  },

  methods: {},
  notifications: {
    showMoveError: {
      title: 'Failed',
      message: 'Error moving task, please contact system admin',
      type: 'error'
    },
    showMoveSuccess: {
      title: 'Success',
      message: 'Successfully moved task',
      type: 'success'
    }
  }
}
</script>

<style scoped>
.mdi-pencil {
  transition: all 0.5s;
  opacity: 0;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 200px !important;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.add-board {
  cursor: pointer;
  height: 100px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.board-color {
  cursor: pointer;
  display: flex;
  justify-content: center;
  float: right;
  border-radius: 100%;
  width: 48px;
  height: 48px;
  transition: background-color 1s;
}
</style>
