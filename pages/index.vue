<template>
  <div class="custom-container">
    <SearchHeader />
    <Page />
  </div>
</template>

<script>
import formValidatorMixin from '@/mixins/formValidatorMixin'
import SearchHeader from '@/components/page/SearchHeader'
import Page from '@/components/Page'

export default {
  name: 'TasksPage',
  components: {
    Page,
    SearchHeader
  },
  mixins: [formValidatorMixin],
  head: () => ({
    title: 'My Tasks'
  })
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
