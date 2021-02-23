<template>
  <TasksList
    :tasks="$store.getters['tasks/getUnassignedTasks']"
    :title="'Unassigned Tasks'"
  >
    <template slot="action" slot-scope="{ task }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon @click="takeTask(task)" v-bind="attrs" v-on="on" right>
            mdi-undo-variant
          </v-icon>
        </template>
        <span>Add task to your board</span>
      </v-tooltip>
    </template>
  </TasksList>
</template>

<script>
import TasksList from '@/components/TasksList'

export default {
  name: 'BrowsePage',
  components: {
    TasksList
  },
  head: () => ({
    title: 'Browse'
  }),
  async created() {
    await this.$store.dispatch('tasks/fetchUnassignedTasks')
  },
  methods: {
    async takeTask(task) {
      await this.$store.dispatch('tasks/takeTask', task)
      this.showTakeSuccess()
    }
  },
  notifications: {
    showTakeSuccess: {
      title: 'Task Taken!',
      message: 'Task has been added to your ToDo board',
      type: 'success'
    }
  }
}
</script>
