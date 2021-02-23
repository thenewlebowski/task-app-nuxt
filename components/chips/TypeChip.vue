<template>
  <v-chip>{{ type }}</v-chip>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'Task'
    }
  }
}
</script>
