<template>
  <div class="d-flex flex-row">
    <div v-for="key in Object.keys(columns)" :key="key">
      <Column :column="columns[key]" />
    </div>
    <!--        <v-col key="add-new-column">-->
    <!--            <v-card max-width="400" class="mx-auto">-->
    <!--                <v-app-bar color="blue-grey">-->
    <!--                    <v-btn icon>-->
    <!--                        <v-icon>mdi-plus</v-icon>-->
    <!--                    </v-btn>-->
    <!--                    <v-text-field-->
    <!--                        v-model="columnName"-->
    <!--                        :error-messages="columnNameErrors"-->
    <!--                        @blur="$v.columnName.$touch()"-->
    <!--                        class="mt-4 color-white"-->
    <!--                        placeholder="Add New Column"-->
    <!--                        required-->
    <!--                    />-->
    <!--                </v-app-bar>-->
    <!--            </v-card>-->
    <!--        </v-col>-->
  </div>
</template>

<script>
// import formValidatorMixin from '@@/mixins/formValidatorMixin'
import Column from './Column'

export default {
  components: {
    Column
  },
  // mixins: [formValidatorMixin],
  data: () => ({
    columns: {}
    // columnName: ''
  }),
  async created() {
    await this.$store.dispatch('tasks/fetchTasks')
    await this.$store.dispatch('user/fetchUsers')
    this.columns = this.$store.getters['tasks/getColumns']
  }
}
</script>
