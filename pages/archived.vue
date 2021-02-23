<template>
  <TasksList
    :tasks="$store.getters['tasks/getArchivedTasks']"
    :title="'Archived Tasks'"
  >
    <template slot="action" slot-scope="{ task }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon @click="unarchiveTask(task)" v-bind="attrs" v-on="on" right>
            mdi-undo-variant
          </v-icon>
        </template>
        <span>Unarchive this task</span>
      </v-tooltip>
    </template>
  </TasksList>
</template>

<script>
import TasksList from '@/components/TasksList'

export default {
  name: 'AllPage',
  components: {
    TasksList
  },
  head: () => ({
    title: 'Archived'
  }),
  async created() {
    await this.$store.dispatch('tasks/fetchArchivedTasks')
  },
  methods: {
    async unarchiveTask(task) {
      await this.$store.dispatch('tasks/unarchiveTask', task._id)
      this.showUnarchiveSuccess()
    }
  },
  notifications: {
    showUnarchiveSuccess: {
      title: 'Unarchived!',
      message: 'Task has been unarchived',
      type: 'success'
    }
  }
}
</script>
