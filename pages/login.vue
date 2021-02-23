<template>
  <v-col cols="12" sm="6" md="4">
    <!--        <no-ssr>-->
    <!--            <v-alert v-if="$auth.$state.redirect" type="error"-->
    <!--                >You have to login before accessing to-->
    <!--                {{ $auth.$state.redirect }}</v-alert-->
    <!--            >-->
    <!--            <v-alert v-if="$auth.loggedIn" type="success"-->
    <!--                >You already logged in yo</v-alert-->
    <!--            >-->
    <!--        </no-ssr>-->
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @keydown.enter="login" @submit.prevent="login" method="post">
          <v-text-field
            v-model.trim="username"
            :error-messages="usernameErrors"
            @input="$v.username.$touch()"
            @blur="$v.username.$touch()"
            label="Username"
            required
            name="username"
            prepend-icon="mdi-login"
            autocomplete="off"
          />

          <v-text-field
            v-model.trim="password"
            :error-messages="passwordErrors"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
            label="Password"
            required
            name="password"
            prepend-icon="mdi-lock"
            type="password"
            autocomplete="off"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn @click.prevent="login" color="primary" type="submit"
          >Login</v-btn
        >
        <v-btn @click="clear">Clear</v-btn>
      </v-card-actions>
      <p class="text-center subtitle-1 pt-2 pb-2">
        <span>Use your Eclipse login &#129303;</span>
        <!--                <img class="img" src="~/assets/eclipsescary.png" />-->
        <!--                <nuxt-link to="/register"> Register!</nuxt-link>-->
      </p>
    </v-card>
  </v-col>
</template>

<script>
import formValidatorMixin from '@@/mixins/formValidatorMixin'

export default {
  name: 'LoginPage',
  layout: 'unauthenticated',
  mixins: [formValidatorMixin],
  data: () => ({
    drawer: null,
    username: '',
    password: ''
  }),
  head: () => ({
    title: 'Login'
  }),
  validations: formValidatorMixin.validations,
  computed: {
    redirect() {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    }
  },
  methods: {
    async login() {
      this.error = null
      await formValidatorMixin.validate
      this.$v.$touch()

      if (!this.$v.invalid) {
        try {
          await this.$auth.loginWith('local', {
            data: {
              username: this.username,
              password: this.password
            }
          })

          this.showLoginSuccess()
          await this.$router.push('/')
        } catch (e) {
          this.showLoginError({
            message: e.response.data.error || e.message
          })
        }
      }
    },
    clear() {
      // const response = this.$store.dispatch('user/fetchUsers')
      this.$v.$reset()
      this.username = ''
      this.password = ''
    }
  },
  notifications: {
    showLoginError: {
      title: 'Login Failed',
      message: 'Failed to authenticate',
      type: 'error'
    },
    showLoginSuccess: {
      title: 'Login Success',
      message: 'Welcome back!',
      type: 'success'
    }
  }
}
</script>
<style>
.img {
  margin-bottom: -10px;
  width: 100px;
}
</style>
