<template>
  <v-chip
    >Reported by
    {{ $store.getters['user/getUsersNameAndIdKey'][reporter] }}</v-chip
  >
</template>

<script>
export default {
  props: {
    reporter: {
      type: String,
      default: 'None'
    }
  }
}
</script>
