<template>
  <v-card width="360" class="mx-1">
    <v-app-bar color="blue-grey">
      <!-- <v-btn icon>
        <v-icon>mdi-settings</v-icon>
      </v-btn> -->
      <v-toolbar-title :column="column" v-text="column.title" />
      <div class="flex-grow-1"></div>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-container class="pa-2" fluid>
      <v-row>
        <v-col>
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
        </v-col>
      </v-row>
      <TaskForm />
    </v-container>
  </v-card>
</template>

<script>
import draggable from 'vuedraggable'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

export default {
  components: {
    draggable,
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
</style>
