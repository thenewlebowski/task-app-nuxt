<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">No Email On File</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            Please enter your email so you can receive notifications about tasks
            which you're involved.
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="email"
                  :error-messages="emailErrors"
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                  label="Email"
                  required
                  name="email"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" color="blue darken-1" text>
            Close
          </v-btn>
          <v-btn
            @click=";(dialog = false), submit()"
            color="blue darken-1"
            text
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import formValidatorMixin from '@@/mixins/formValidatorMixin'
import { mapState } from 'vuex'

export default {
  name: 'NoEmailPrompt',
  mixins: [formValidatorMixin],
  data: () => ({
    email: '',
    dialog: false
  }),
  computed: {
    ...mapState('auth', ['loggedIn', 'user'])
  },
  created() {
    if (this.loggedIn && !this.user.email) {
      this.dialog = true
    }
  },
  methods: {
    submit() {
      const payload = {
        email: this.email
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

<style scoped></style>
