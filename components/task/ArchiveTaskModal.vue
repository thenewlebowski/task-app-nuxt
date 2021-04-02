<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" outlined text>Archive</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        Are you sure?
      </v-card-title>

      <v-card-text>
        Are you sure you want to archive this task? This action is irreversible.
      </v-card-text>

      <v-card-actions>
        <div class="flex-grow-1"></div>

        <v-btn @click="dialog = false" color="green" text>
          Cancel
        </v-btn>

        <v-btn @click="handleArchiveTask" color="red" text>
          Archive
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    taskId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    handleArchiveTask() {
      this.$store.dispatch('tasks/archiveTask', this.taskId)
      this.dialog = false
      this.$emit('archived')
    }
  }
}
</script>
