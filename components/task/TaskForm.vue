<template>
  <v-dialog v-model="dialog" outlined persistent max-width="75%">
    <template v-slot:activator="{ on }">
      <slot name="button">
        <v-btn v-on="on" outlined text>{{
          !taskToEdit ? 'Add Task' : 'Edit'
        }}</v-btn>
      </slot>
    </template>
    <v-card>
      <v-toolbar>
        <span class="headline">{{
          !taskToEdit ? 'Add New Task' : 'Edit Task'
        }}</span>
        <v-spacer> </v-spacer>
        <v-menu
          :close-on-content-click="false"
          bottom
          left
          offset-y
          max-width="100%"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" outlined text>Edit Dates</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <DatePickerDialog
                :date="dateCompleted"
                @update-date="updateDate"
                message="Edit Completion Date"
                type="dateCompleted"
              />
              <span class="ml-5"
                >Date Completed : {{ dateCompleted || 'None' }}
              </span>
            </v-list-item>
            <v-list-item>
              <DatePickerDialog
                :date="dateDue"
                @update-date="updateDate"
                message="Edit Due Date"
                type="dateDue"
              />
              <span class="ml-5 float-right"
                >Due Date : {{ dateDue || 'None' }}
              </span>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>

      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="title"
              :error-messages="titleErrors"
              :counter="100"
              @blur="$v.title.$touch()"
              @change="$v.title.$touch()"
              label="Title*"
              required
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

          <v-col cols="12">
            <v-textarea
              @blur="$v.description.$touch()"
              @change="$v.description.$touch()"
              :error-messages="descriptionErrors"
              v-model="description"
              label="Description"
              auto-grow
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
              item-text="username"
              item-value="key"
              label="Assignee"
              return-object
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="status"
              :items="Object.values(boardKey)"
              label="Status/ Board*"
              required
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn @click="dialog = false" color="blue darken-1" text>Cancel</v-btn>
        <v-btn @click="handleSubmit" color="blue darken-1" text>Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import ToolTipChip from '@/components/chips/ToolTipChip'
import DatePickerDialog from '@/components/buttons/DatePickerDialog'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'TaskForm',
  components: {
    ToolTipChip,
    DatePickerDialog
  },
  mixins: [validationMixin],
  props: {
    taskToEdit: {
      type: Object,
      default: null
    }
  },
  validations: {
    title: {
      required,
      maxLength: maxLength(100)
    },
    description: {
      minLength: minLength(10)
    },
    assignee: {},
    priority: { required },
    type: { required },
    site: { required },
    points: { required }
  },
  data() {
    return {
      title: '',
      description: '',
      priority: 'Lowest',
      type: 'Task',
      site: 'PlumbersStock',
      points: 10,
      status: '',
      assignee: '',
      priorityLevels: ['Lowest', 'Low', 'Medium', 'High', 'Highest'],
      types: ['Task', 'Problem', 'General', 'Styling'],
      board: null,
      sites: this.$store.state.tasks.sites,
      dateDue: null,
      dateCompleted: null,
      dialog: false,
      error: null,
      submitStatus: null
    }
  },
  computed: {
    // date() {
    //   return this.dateCompleted
    //     ? this.dateCompleted.substring(0, this.dateCompleted.indexOf('T'))
    //     : this.$moment(Date.now()).format('YYYY-MM-DD')
    // },
    // values
    boardKey() {
      return this.$store.getters['boards/getBoardKey']
    },
    nameKey() {
      // switches name for id
      return this.$store.getters['user/getUsersNameAndIdKey']
    },
    // errors
    titleErrors() {
      const errors = []
      if (!this.$v.title.$dirty) return errors
      !this.$v.title.maxLength &&
        errors.push('Title must be at most 100 characters long')
      !this.$v.title.required && errors.push('Title is required.')
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.description.$dirty) return errors
      !this.$v.description.minLength &&
        errors.push('Description has a minimum length of 10.')
      return errors
    },
    priorityErrors() {
      const errors = []
      if (!this.$v.priority.$dirty) return errors
      !this.$v.priority.required && errors.push('Priority is required.')
      return errors
    },
    typeErrors() {
      const errors = []
      if (!this.$v.type.$dirty) return errors
      !this.$v.type.required && errors.push('Type is required.')
      return errors
    },
    siteErrors() {
      const errors = []
      if (!this.$v.site.$dirty) return errors
      !this.$v.site.required && errors.push('Site is required.')
      return errors
    },
    pointsErrors() {
      const errors = []
      if (!this.$v.points.$dirty) return errors
      !this.$v.points.required && errors.push('Points is required.')
      return errors
    },
    assigneeErrors() {
      const errors = []
      if (!this.$v.assignee.$dirty) return errors
      // !this.$v.assignee.required && errors.push('Assignee is required.')
      return errors
    },
    reporterErrors() {
      const errors = []
      if (!this.$v.reporter.$dirty) return errors
      !this.$v.reporter.required && errors.push('Reporter is required.')
      return errors
    }
  },
  mounted() {
    if (this.taskToEdit) {
      Object.keys(this.taskToEdit).forEach((key) => {
        if (key in this) {
          Vue.set(this, key, this.taskToEdit[key])
        }
      })
      const dateCompleted = this.taskToEdit.dateCompleted
      const dateDue = this.taskToEdit.dateDue
      this.dateCompleted = dateCompleted
        ? this.$moment(dateCompleted).format('YYYY-MM-DD')
        : null
      this.dateDue = dateDue ? this.$moment(dateDue).format('YYYY-MM-DD') : null
      this.assignee = this.nameKey[this.assignee]
    }
  },
  methods: {
    updateDate(value) {
      this[value.type] = value.date
      // this.taskToEdit ? (this.dateCompleted = value) : (this.dueDate = value)
    },
    handleSubmit() {
      // assignee logic
      if (this.assignee) this.assigneeId = this.assignee._id

      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      // board logic
      this.board = Object.keys(this.boardKey).filter(
        (key) => this.boardKey[key] === this.status
      )[0]

      if (this.taskToEdit) {
        if (!this.taskToEdit.reporter)
          this.taskToEdit.reporter = '6046b01ed5ca7434f7e2fbff'
        const user = this.$auth.user
        if (
          user._id.toString() === this.assigneeId.toString() ||
          user._id.toString() === this.taskToEdit.reporter.toString() ||
          user.admin
        ) {
          this.handleEditTask()
        } else {
          this.showRefuse()
        }
      } else {
        this.handleAddTask()
      }
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
        assignee: this.assigneeId,
        board: this.board,
        reporter: this.$auth.user._id
      }

      this.$store
        .dispatch('tasks/addTask', task)
        .then((res) => {
          if (res.status !== 200) throw new Error(res)
          this.showSuccess()
          this.dialog = false
          this.clear()
        })
        .catch(() => {
          this.showError()
        })
    },
    handleEditTask() {
      const payload = {
        update: {
          type: this.type,
          site: this.site,
          board: this.board,
          title: this.title,
          points: this.points,
          status: this.status,
          dateDue: this.dateDue,
          priority: this.priority,
          assignee: this.assigneeId,
          description: this.description,
          dateCompleted: this.dateCompleted
        },
        taskId: this.taskToEdit._id,
        route: this.$route.name
      }

      this.$store
        .dispatch('tasks/updateTask', payload)
        .then((res) => {
          if (res.status !== 200) throw new Error(res)
          this.showSuccess()
          this.dialog = false
          // this.clear()
        })
        .catch(() => {
          this.showError()
        })
    },
    clear() {
      this.$v.$reset()
      this.title = ''
      this.description = ''
      this.priority = ''
      this.type = ''
      this.status = ''
      this.points = 10
      this.assignee = ''
      this.reporter = ''

      this.dialog = false
    }
  },
  notifications: {
    showRefuse: {
      title: 'Failed',
      message:
        'You need to be the reporter, assignee, or an admin to edit this task',
      type: 'error'
    },
    showError: {
      title: 'Failed',
      message:
        'Failed to submit task please check forms for errors or try again later',
      type: 'error'
    },
    showSuccess: {
      title: 'Success',
      message: 'Succesfully submitted task',
      type: 'success'
    }
  }
}
</script>
