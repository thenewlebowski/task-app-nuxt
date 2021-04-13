<template>
  <v-card width="360" class="mx-1">
    <v-app-bar color="blue-grey">
      <!-- <v-btn icon>
        <v-icon>mdi-settings</v-icon>
      </v-btn> -->
      <v-toolbar-title :board="boardCopy" v-text="boardCopy.title" />
      <div v-if="boardCopy.title === 'Add Board'">
        <v-chip class="ma-2" color="green" text-color="white">New</v-chip>
      </div>
      <div class="flex-grow-1"></div>
      <div
        v-if="boardCopy.color"
        v-bind:style="{ backgroundColor: boardCopy.color }"
        class="board-color"
      ></div>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
          <div v-if="boardCopy.title !== 'Add Board'">
            <draggable
              v-model="boardCopy.tasks"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
              @change="(evt) => handleMoveTask(evt, boardCopy.title)"
              class="list-group pl-0"
              group="tasks"
              tag="ul"
            >
              <li
                v-for="task in boardCopy.tasks"
                :key="task.id"
                class="list-group-item"
              >
                <TaskCard :task="task" />
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
    board: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    drag: false,
    boardCopy: {
      title: 'Unassigned',
      tasks: []
    }
  }),
  computed: {
    dragOptions() {
      return {
        delay: 200,
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
        scrollSensitivity: 200,
        scrollSpeed: 25,
        forceFallback: true,
        delayOnTouchOnly: true
      }
    }
  },
  mounted() {
    this.boardCopy = { ...this.board }
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order)
    },
    handleMoveTask(evt) {
      if (evt.added || evt.moved) {
        const { element, newIndex } = evt.added || evt.moved
        element.index = newIndex
        const payload = {
          task: element,
          board: this.boardCopy,
          route: this.$route.name
        }
        this.$store
          .dispatch('tasks/moveTask', payload)
          .then((res) => {
            if (res.status !== 200) {
              throw new Error(res)
            }
            this.$store
              .dispatch('boards/updateBoard', res.data.tasks)
              .then((res) => {
                this.showMoveSuccess()
              })
              .catch((err) => {
                this.showMoveError()
                return err
              })
          })
          .catch((err) => {
            // this.boardCopy.tasks = this.board.tasks
            this.showMoveError()
            return err
          })
      }
    }
  },
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
  float: right;
  border-radius: 100%;
  width: 48px;
  height: 48px;
  transition: background-color 1s;
}
</style>
