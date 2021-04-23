<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    bottom
    offset-y
    min-width="600"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" outlined text>
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-system-bar class="p-5" color="#75485E" dark>
        <v-card-title>Filter</v-card-title>
        <v-spacer></v-spacer>

        <v-btn @click="menu = false" class="mr-2" x-small color="warning"
          ><v-icon>mdi-window-minimize</v-icon></v-btn
        >

        <!-- <v-btn x-small><v-icon>mdi-window-maximize</v-icon></v-btn> -->
        <v-menu v-model="nested">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small color="red"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </template>
          <v-list :style="{ 'text-align': 'center' }">
            <v-list-item-title>This will clear everything, </v-list-item-title>
            <v-list-item-title>are you sure?</v-list-item-title>
            <v-list-item @click="clear()">
              <v-list-item-title>Yes</v-list-item-title>
            </v-list-item>
            <v-list-item @click="nested = false">
              <v-list-item-title>No</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-system-bar>
      <v-container>
        <v-col cols="12">
          <v-select
            v-model="site"
            :items="Object.values(sites)"
            clearable
            label="Site"
            single-line
          />
          <v-select
            v-model="priority"
            :items="Object.values(priorities)"
            clearable
            label="Priority"
            single-line
          />
          <v-select
            v-model="assignee"
            :items="Object.values(idKey)"
            clearable
            item-text="username"
            item-value="_id"
            label="Assignee"
            return-object
          />
          <v-select
            v-model="reporter"
            :items="Object.values(idKey)"
            clearable
            item-text="username"
            item-value="_id"
            label="Reporter"
            return-object
          />
          <v-select
            v-model="type"
            :items="Object.values(types)"
            clearable
            label="Type"
            single-line
          />
        </v-col>
        <v-flex class="justify-space-between d-flex">
          <v-btn @click="clear()" color="warning">
            Clear
          </v-btn>
          <v-btn @click="submit()" color="info">
            Submit
          </v-btn>
        </v-flex>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'FilterBoards',
  data() {
    return {
      site: null,
      type: null,
      menu: false,
      nested: false,
      assignee: null,
      reporter: null,
      priority: null,
      sites: this.$store.state.tasks.sites,
      types: this.$store.state.varieties.types,
      priorities: this.$store.state.varieties.priorities,
      assignees: this.$store.getters['user/getUsersNameAndIdKey'],
      reporters: this.$store.getters['user/getUsersNameAndIdKey']
    }
  },
  computed: {
    idKey() {
      return this.$store.state.user.idKey
    }
    // sites() {
    //   return this.$store.varieties.sites
    // },
    // priorities() {
    //   return this.$store.varieties.priorities
    // },
    // assignees() {
    //   return this.$store.varieties.assignees
    // },
    // reporters() {
    //   return this.$store.varieties.reporters
    // },
    // types() {
    //   return this.$store.varieties.types
    // }
  },
  async created() {
    if (Object.keys(this.$store.state.user.idKey).length < 1) {
      await this.$store.dispatch('user/fetchUsers')
    }
  },
  methods: {
    submit() {
      const payload = {
        assignee: this.assignee ? this.assignee._id : null,
        reporter: this.reporter ? this.reporter._id : null,
        priority: this.priority,
        type: this.type,
        site: this.site
      }
      this.$store.dispatch('boards/filterBoards', payload)
      this.menu = false
    },
    clear() {
      this.site = null
      this.type = null
      this.menu = false
      this.reporter = null
      this.assignee = null
      this.priority = null
      this.$store.dispatch('boards/resetFilter')
    }
  }
}
</script>

<style></style>
