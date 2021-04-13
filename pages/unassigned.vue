<template>
  <TasksList
    :tasks="$store.getters['tasks/getUnassignedTasks']"
    :title="'Unassigned Tasks'"
  >
    <template slot="action" slot-scope="{ task }">
      <v-menu max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" right>
            mdi-undo-variant
          </v-icon>
        </template>
        <v-list>
          <v-list-item
            v-for="(board, boardId) in boardKey"
            @click="takeTask(task, boardId)"
            v-bind:key="boardId"
          >
            <v-list-item-title>{{ board }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </TasksList>
</template>

<script>
import TasksList from '@/components/task/TasksList'
import TakeTask from '@/components/task/TakeTask'

export default {
  name: 'BrowsePage',
  components: {
    TasksList,
    TakeTask
  },
  head: () => ({
    title: 'Browse'
  }),
  data: () => ({
    boardKey: {},
    dialog: false,
    successMsg: ''
  }),
  async created() {
    await this.$store.dispatch('tasks/fetchUnassignedTasks')
    await this.$store.dispatch('boards/fetchBoards')
    this.boardKey = await this.$store.getters['boards/getBoardKey']
  },
  methods: {
    async takeTask(task, boardId) {
      const payload = {
        task,
        status,
        boardId
      }
      await this.$store
        .dispatch('tasks/takeTask', payload)
        .then((res) => {
          this.successMsg = `Task has been added to your ${status} board`
          this.showTakeSuccess()
        })
        .catch((err) => {
          this.showTakeError()
          console.log(err)
        })
    }
  },
  notifications: {
    showTakeSuccess: {
      title: 'Task Taken!',
      message: `Task has been added to your list`,
      type: 'success'
    },
    showTakeError: {
      title: 'Failed',
      message:
        'Task failed to be added to your board, check to see if board exists and try again',
      type: 'error'
    }
  }
}
</script>
