<template>
  <Page :user-id="this.$route.params.user" />
</template>

<script>
import Page from '@/components/Page'
export default {
  name: 'UserPage',
  components: {
    Page
  },
  data: () => ({
    boards: {}
  }),
  setup() {},
  async created() {
    const id = this.$route.params.user
    await this.$store.dispatch('boards/fetchBoards', id)
  }
}
</script>
