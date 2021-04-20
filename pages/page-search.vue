<template>
  <v-card>
    <v-app-bar>
      <v-icon>mdi-magnify</v-icon>
      <v-toolbar-title class="mx-5">
        Search
      </v-toolbar-title>
      <v-text-field
        ref="search"
        v-model="search"
        text-field-details-margin-bottom="0"
        placeholder="Type / to start searching (search by either username or full name)"
      />
    </v-app-bar>
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#385F73" dark>
            <v-card-title class="text-h5">
              Search for other users
            </v-card-title>

            <v-card-subtitle
              >Search for other users by their username or their actual name.
              See their progress on a certain task and what they got done the in
              the previous week. Other features are yet to be unlocked, such as,
              messaging other users and starting threads.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn text>
                Feeling Lucky
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-for="(user, i) in users" :key="i" cols="12" lg="4">
          <v-card>
            <v-app-bar>
              <v-btn @click="profile(user._id)" rounded>
                <v-avatar>
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                  <span v-else v-text="initials(user)" class="headline" />
                </v-avatar>
                <v-card-title
                  v-if="user.firstName && user.lastName"
                  v-text="`${user.firstName} ${user.lastName}`"
                >
                </v-card-title>
                <v-card-title v-else v-text="user.username"></v-card-title>
              </v-btn>
            </v-app-bar>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'SearchPage',
  components: {},
  data: () => ({
    search: null,
    users: []
  }),
  head: () => ({
    title: 'Search'
  }),
  computed: {},
  watch: {
    search() {
      this.$nextTick(
        () =>
          (this.search = this.search
            .split('')
            .filter((char) => char !== '/')
            .join(''))
      )
      this.users = this.$store.getters['user/getUsers'].filter((user) => {
        const { username, firstName, lastName } = user
        const fullName = `${firstName} ${lastName}`
        if (fullName.includes(this.search.toUpperCase())) return true
        if (username.includes(this.search.toUpperCase())) return true
        return false
      })
    }
  },
  beforeMount() {
    window.addEventListener('keypress', this.focusSearch)
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.focusSearch)
  },
  async created() {
    await this.$store.dispatch('user/fetchUsers')
    this.users = this.$store.getters['user/getUsers']
  },
  methods: {
    focusSearch(e) {
      if (e.keyCode === 47) {
        this.$nextTick(async () => {
          await this.$refs.search.focus()
          this.search = ''
        })
      }
    },
    initials(user) {
      if (user.firstName && user.lastName) {
        return (user.firstName[0] + user.lastName[0]).toUpperCase()
      } else if (user.username) {
        const username = user.username
        return (username[0] + username.slice(-1)).toUpperCase()
      }
      return null
    },
    profile(id) {
      this.$router.push({
        path: `/page/${id}`
      })
    }
  }
}
</script>

<style scoped>
.v-input__slot {
  margin-bottom: 0 !important;
}
</style>
