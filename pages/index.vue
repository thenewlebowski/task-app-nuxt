<template>
  <div>
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
