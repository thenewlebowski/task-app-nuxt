<template>
  <form>
    <v-row align="center">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="firstName"
          :error-messages="firstNameErrors"
          :counter="10"
          @input="$v.firstName.$touch()"
          @blur="$v.firstName.$touch()"
          label="First Name"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="lastName"
          :error-messages="lastNameErrors"
          :counter="10"
          @input="$v.lastName.$touch()"
          @blur="$v.lastName.$touch()"
          label="Last Name"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          label="E-mail"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="10">
        <div v-if="userDepartments.length > 0">
          <div
            v-for="(department, index) in userDepartments"
            v-bind:key="index"
          >
            <v-select
              :items="Object.values(allDepartments)"
              @input="setDepartments"
              :value="allDepartments[department]"
              label="Department"
              required
            />
          </div>
        </div>
        <div v-else>
          <v-select
            :items="Object.values(allDepartments)"
            @input="setDepartments"
            label="Department"
          />
        </div>
      </v-col>
      <v-col cols="1">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              @click="showDepartmentDropdown"
              color="primary"
              class="float-right"
              ><v-icon>mdi-chevron-double-down</v-icon></v-btn
            >
          </template>
          <span>Add another department to your account</span>
        </v-tooltip>
      </v-col>
      <v-col cols="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="showDepartmentModal"
              v-on="on"
              v-bind="attrs"
              color="success"
              class="float-right"
              ><v-icon>mdi-plus-box</v-icon></v-btn
            >
          </template>
          <span>Add new department to database</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-btn @click="submit" color="success" class="mr-4">submit</v-btn>
    <v-btn @click="clear" color="danger">clear</v-btn>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'SettingsPage',
  mixins: [validationMixin],
  validations: {
    firstName: { required, maxLength: maxLength(10) },
    lastName: { required, maxLength: maxLength(10) },
    email: { required, email }
  },
  data: () => ({
    userDepartments: [],
    allDepartments: {},
    lastName: '',
    firstName: '',
    email: ''
  }),
  head: () => ({
    title: 'Settings'
  }),
  computed: {
    lastNameErrors() {
      const errors = []
      if (!this.$v.lastName.$dirty) return errors
      !this.$v.lastName.maxLength &&
        errors.push('Name must be at most 10 characters long')
      !this.$v.lastName.required && errors.push('Last name is required.')
      return errors
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.firstName.$dirty) return errors
      !this.$v.firstName.maxLength &&
        errors.push('Name must be at most 10 characters long')
      !this.$v.firstName.required && errors.push('First Name is required.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    }
  },
  async created() {
    await this.$store.dispatch('departments/fetchDepartments')

    this.allDepartments = this.$store.getters['departments/getDepartments']
    this.userDepartments = this.$store.$auth.state.user.departments || []
    this.firstName = this.$store.$auth.$state.user.firstName || ''
    this.lastName = this.$store.$auth.$state.user.lastName || ''
    this.email = this.$store.$auth.$state.user.email || ''
  },
  methods: {
    showDepartmentDropdown() {
      this.userDepartments = this.userDepartments.filter((d) => d)
      this.userDepartments.push(null)
    },
    showDepartmentModal() {
      // const v = this.$v
    },
    setDepartments(v) {
      for (const [key, value] of Object.entries(this.allDepartments)) {
        if (v === value) v = key
      }

      // make sure there isn't two of the same department
      this.userDepartments = this.userDepartments.filter((d) => {
        if (d && d !== v) {
          return true
        } else return false
      })
      this.userDepartments.push(v)
    },
    submit() {
      this.$v.$touch()
      this.userDepartments = this.userDepartments.filter((d) => d)
      if (this.$v.$error) return this.$v.$errors

      const payload = {
        firstName: this.$v.firstName.$model,
        lastName: this.$v.lastName.$model,
        email: this.$v.email.$model,
        departments: this.userDepartments
      }

      this.$store
        .dispatch('user/update', payload)
        .then((res) => {
          if (res.status !== 200) throw new Error(res)
          this.showUpdateSuccess()
        })
        .catch(() => {
          this.showUpdateError()
        })
    },
    clear() {
      this.$v.$reset()
      this.firstName = ''
      this.lastName = ''
      this.email = ''
    }
  },
  notifications: {
    showUpdateError: {
      title: 'Failed',
      message:
        'Failed to update your profile please try again later or contact system admin',
      type: 'error'
    },
    showUpdateSuccess: {
      title: 'Success',
      message: 'Succesfully updated profile',
      type: 'success'
    }
  }
}
</script>
