<template>
  <v-chip>{{ user ? `Reported by ${user.username}` : 'Reporter N/A' }}</v-chip>
</template>

<script>
export default {
  props: {
    reporter: {
      type: String || Boolean,
      default: false
    }
  },
  data() {
    return {
      user: this.$store.getters['user/getUsersNameAndIdKey'][this.reporter]
    }
  }
}
</script>
