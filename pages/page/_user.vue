<template>
  <div class="custom-container">
    <SearchHeader />
    <Page :user-id="this.$route.params.user" />
  </div>
</template>

<script>
import Page from '@/components/Page'
import SearchHeader from '@/components/page/SearchHeader'

export default {
  name: 'UserPage',
  components: {
    Page,
    SearchHeader
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

<style scoped>
.custom-container {
  padding: 12px;
  overflow: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
