<template>
  <v-card class="d-fixed m-bottom-5 page-header" dark>
    <!-- <v-card > -->
    <v-toolbar color="#385F73">
      <v-card-title class="text-h5">
        {{ user ? user.username : 'Boards' }}
      </v-card-title>
      <ToolTipChip
        :left="true"
        title="W.I.P"
        width="300"
        tooltip="The search header is currently a work in progress and hasn't had all the functionality added to it yet. In the coming weeks search and filtration will become available giving you the ability to sort through your tasks fairly easily."
      />
      <v-spacer />
      <FilterBoards />
      <v-text-field
        ref="search"
        v-model="search"
        class="mx-4"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        placeholder="Find it quick (Type / to search)"
      />
      <TaskForm />
    </v-toolbar>
  </v-card>
</template>

<script>
import TaskForm from '@/components/task/TaskForm'
import ToolTipChip from '@/components/chips/ToolTipChip'
import FilterBoards from '@/components/buttons/FilterBoards'

export default {
  name: 'SearchHeader',
  components: {
    TaskForm,
    ToolTipChip,
    FilterBoards
  },
  data() {
    return {
      user: this.$store.getters['user/getUsersNameAndIdKey'][
        this.$route.params.user
      ],
      search: null
    }
  },
  watch: {
    search() {
      this.$nextTick(
        () =>
          (this.search = this.search
            .split('')
            .filter((char) => char !== '/')
            .join(''))
      )
      if (this.search !== '/' && this.search !== '') {
        const varients = ['priority', 'type', 'site', 'title', 'description']
        const payload = Object()
        varients.map((v) => (payload[v] = this.search))
        this.$store.dispatch('boards/searchBoards', payload)
      } else if (this.search === '') this.$store.dispatch('boards/resetFilter')

      // this.users = this.$store.getters['user/getUsers'].filter((user) => {
      //   const { username, firstName, lastName } = user
      //   const fullName = `${firstName} ${lastName}`
      //   if (fullName.includes(this.search.toUpperCase())) return true
      //   if (username.includes(this.search.toUpperCase())) return true
      //   return false
      // })
    }
  },
  beforeMount() {
    window.addEventListener('keypress', this.focusSearch)
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.focusSearch)
  },
  methods: {
    focusSearch(e) {
      if (e.keyCode === 47) {
        this.$nextTick(async () => {
          await this.$refs.search.focus()
          this.search = ''
        })
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 9999;
}
</style>
