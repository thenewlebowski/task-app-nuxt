<template>
  <form>
    <v-text-field
      v-model="firstName"
      :error-messages="firstNameErrors"
      :counter="10"
      @input="$v.firstName.$touch()"
      @blur="$v.firstName.$touch()"
      label="First Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="lastName"
      :error-messages="lastNameErrors"
      :counter="10"
      @input="$v.lastName.$touch()"
      @blur="$v.lastName.$touch()"
      label="Last Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
      label="E-mail"
      required
    ></v-text-field>
    <v-btn @click="submit" class="mr-4">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
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
  created() {
    this.firstName = this.$store.$auth.$state.user.firstName || ''
    this.lastName = this.$store.$auth.$state.user.lastName || ''
    this.email = this.$store.$auth.$state.user.email || ''
  },
  methods: {
    submit() {
      this.$v.$touch()

      if (this.$v.$error) return this.$v.$errors
      const payload = {
        firstName: this.$v.firstName.$model,
        lastName: this.$v.lastName.$model,
        email: this.$v.email.$model
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
