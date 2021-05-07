<template>
  <v-card v-if="!loading">
    <TaskInfo />
  </v-card>
</template>

<script>
import TaskInfo from '@/components/task/focus/TaskInfo'
export default {
  components: { TaskInfo },
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    if (Object.keys(this.$store.state.user.idKey).length < 1) {
      await this.$store.dispatch('user/fetchUsers')
    }
    await this.$store.dispatch('tasks/fetchSpecific', this.$route.params.id)
    this.loading = false
  }
}
</script>

<style></style>
