<template>
  <div>
    <Page />
  </div>
</template>

<script>
import formValidatorMixin from '@@/mixins/formValidatorMixin'
import Page from '@@/components/Page'

export default {
  name: 'TasksPage',
  components: {
    Page
  },
  mixins: [formValidatorMixin],
  head: () => ({
    title: 'My Tasks'
  })
}
</script>
