<template>
  <v-chip>{{ points }} points</v-chip>
</template>

<script>
export default {
  props: {
    points: {
      type: Number,
      default: 0
    }
  }
}
</script>
