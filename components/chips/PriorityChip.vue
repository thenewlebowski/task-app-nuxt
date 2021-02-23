<template>
  <v-chip class="overline">{{ priority }}</v-chip>
</template>

<script>
export default {
  props: {
    priority: {
      type: String,
      default: 'Medium'
    }
  },
  data: () => ({
    value: true
  })
}
</script>
