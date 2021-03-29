<template>
  <v-card width="360" class="mx-1">
    <v-app-bar color="blue-grey">
      <!-- <v-btn icon>
        <v-icon>mdi-settings</v-icon>
      </v-btn> -->
      <v-toolbar-title :column="column" v-text="column.title" />
      <div class="flex-grow-1"></div>
      <div
        v-bind:style="{ backgroundColor: column.color }"
        class="board-color"
      ></div>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
          <div v-if="column.title !== 'Add Board'">
            <draggable
              v-model="columnCopy.tasks"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
              @change="(evt) => handleMoveTask(evt, columnCopy.title)"
              class="list-group pl-0"
              group="tasks"
              tag="ul"
            >
              <li
                v-for="task in columnCopy.tasks"
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
import BoardForm from './board/BoardForm'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

export default {
  components: {
    draggable,
    BoardForm,
    TaskForm,
    TaskCard
  },
  props: {
    column: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    drag: false,
    columnCopy: {
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
    this.columnCopy = { ...this.column }
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order)
    },
    handleMoveTask(evt, toColumnTitle) {
      if (evt.added) {
        window.console.log(evt, toColumnTitle)
        const task = evt.added.element

        const payload = {
          originalTask: task,
          update: {
            status: toColumnTitle,
            index: evt.added.newIndex
          }
        }

        this.$store.dispatch('tasks/moveTask', payload)
      }
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
