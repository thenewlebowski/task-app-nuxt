<template>
  <div class="overflow-x-auto">
    <Board />
  </div>
</template>

<script>
import formValidatorMixin from '@@/mixins/formValidatorMixin'
import Board from '@@/components/Board'

export default {
  name: 'TasksPage',
  components: {
    Board
  },
  mixins: [formValidatorMixin],
  head: () => ({
    title: 'My Tasks'
  })
}
</script>
