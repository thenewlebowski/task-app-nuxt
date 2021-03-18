<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <slot name="button">
        <v-btn v-on="on" outlined text>{{
          !taskToEdit ? 'Add Task' : 'Edit'
        }}</v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{
          !taskToEdit ? 'Add New Task' : 'Edit Task'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="title"
                :error-messages="titleErrors"
                :counter="70"
                @blur="$v.title.$touch()"
                label="Title*"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                :error-messages="descriptionErrors"
                @blur="$v.description.$touch()"
                label="Description"
                height="100"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="priority"
                :items="priorityLevels"
                :error-messages="priorityErrors"
                @change="$v.priority.$touch()"
                @blur="$v.priority.$touch()"
                label="Priority*"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="type"
                :items="types"
                :error-messages="typeErrors"
                @change="$v.type.$touch()"
                @blur="$v.type.$touch()"
                label="Type*"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="site"
                :items="sites"
                :error-messages="siteErrors"
                @change="$v.site.$touch()"
                @blur="$v.site.$touch()"
                label="Site*"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="points"
                :error-messages="pointsErrors"
                @change="$v.points.$touch()"
                @blur="$v.points.$touch()"
                class="mt-4"
                max="100"
                min="10"
                step="10"
                hide-details
                thumb-label="always"
                label="Points*"
                required
              >
              </v-slider>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="assignee"
                :items="Object.values(nameKey)"
                :error-messages="assigneeErrors"
                @change="$v.assignee.$touch()"
                @blur="$v.assignee.$touch()"
                label="Assignee"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="status"
                :items="statusTypes"
                :error-messages="statusErrors"
                @change="$v.status.$touch()"
                @blur="$v.status.$touch()"
                label="Status*"
                required
              />
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn @click="clear" color="blue darken-1" text>Cancel</v-btn>
        <v-btn @click="handleSubmit" color="blue darken-1" text>Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import formValidatorMixin from '@@/mixins/formValidatorMixin'

export default {
  mixins: [formValidatorMixin],
  props: {
    taskToEdit: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    title: '',
    description: '',
    priority: 'Lowest',
    type: 'Task',
    site: 'PlumbersStock',
    points: 10,
    status: 'To Do',
    assignee: 'Unassigned Tasks',
    priorityLevels: ['Lowest', 'Low', 'Medium', 'High', 'Highest'],
    types: ['Task', 'Problem', 'General', 'Styling'],
    statusTypes: ['To Do', 'In Progress', 'Done', 'Backlog'],
    sites: [
      'Adams&Co',
      'CaseInPoint',
      'Confluence',
      'Connectship',
      'CowboyLiving',
      'CraftDirect',
      'MonkeyWrench',
      'PlumbersStock',
      'Typhoeus',
      'Rayie',
      'SWPlumbing',
      'SupplyExchange',
      'Third Party',
      'Uncategorized',
      'General',
      'IT Task',
      'Marketplace',
      'Wiser',
      'Strikeaprice',
      'TCGM',
      'WIT',
      'Google Express',
      'MowRo',
      'Alarm dot com'
    ],
    dialog: false,
    error: null,
    submitStatus: null
  }),
  computed: {
    nameKey() {
      // switches name for id
      return this.$store.getters['user/getUsersNameAndIdKey']
    }
  },
  created() {
    if (this.taskToEdit) {
      Object.keys(this.taskToEdit).forEach((key) => {
        if (key in this) {
          this[key] = this.taskToEdit[key]
        }
      })
      this.assignee = this.nameKey[this.assignee]
    }
  },
  methods: {
    handleSubmit() {
      this.$v.$touch()
      // if (this.$v.$error) return
      // console.log('errors', this.$v)
      if (this.taskToEdit) {
        this.handleEditTask()
      } else {
        this.handleAddTask()
      }

      this.dialog = false
    },
    handleAddTask() {
      const task = {
        title: this.title,
        description: this.description,
        priority: this.priority,
        type: this.type,
        status: this.status,
        index: null,
        site: this.site,
        points: this.points,
        assignee: Object.keys(this.nameKey).filter(
          (key) => this.nameKey[key] === this.assignee
        )[0],
        reporter: this.$auth.user._id
      }
      // if (route === 'index') {
      //   task.reporter = this.$auth.user._id
      // } else if (route === 'browse') {
      //   task.reporter = null
      // }

      this.$store.dispatch('tasks/addTask', task)
      this.dialog = false
    },
    handleEditTask() {
      const payload = {
        update: {
          title: this.title,
          description: this.description,
          priority: this.priority,
          type: this.type,
          status: this.status,
          index: null,
          site: this.site,
          points: this.points,
          assignee: Object.keys(this.nameKey).filter(
            (key) => this.nameKey[key] === this.assignee
          )[0]
        },
        taskId: this.taskToEdit._id
      }

      this.$store.dispatch('tasks/updateTask', payload)
    },
    clear() {
      this.$v.$reset()
      this.task = {
        title: '',
        description: '',
        priority: '',
        type: '',
        status: '',
        points: 10,
        assignee: '',
        reporter: ''
      }

      this.dialog = false
    }
  }
}
</script>
