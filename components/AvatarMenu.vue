<template>
  <v-menu transition="slide-y-transition" bottom>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" fab>
        <v-avatar>
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
          <span v-else v-text="userInitials" class="headline" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="goToProfile">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('auth', ['loggedIn', 'user']),
    userInitials() {
      if (this.user.firstName && this.user.lastName) {
        return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase()
      } else if (this.user.username) {
        const username = this.user.username
        return (username.slice(-1) + username[0]).toUpperCase()
      }

      return 'N/A'
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    },
    goToProfile() {
      this.$router.push({
        path: '/settings'
      })
    }
  }
}
</script>
