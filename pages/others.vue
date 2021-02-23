<template>
  <TasksList
    :tasks="$store.getters['tasks/getOthersTasks']"
    :title="'Others\' Tasks'"
  />
</template>

<script>
import TasksList from '@/components/TasksList'

export default {
  name: 'AllPage',
  components: {
    TasksList
  },
  head: () => ({
    title: "Others'"
  }),
  async created() {
    await this.$store.dispatch('tasks/fetchOthersTasks')
  }
}
</script>
