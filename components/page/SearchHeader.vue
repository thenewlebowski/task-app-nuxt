<template>
  <v-card class="d-fixed m-bottom-5 page-header" dark>
    <!-- <v-card > -->
    <v-toolbar color="#385F73">
      <v-card-title class="text-h5">
        {{
          this.$store.getters['user/getUsersNameAndIdKey'][
            this.$route.params.user
          ] || 'Boards'
        }}
      </v-card-title>
      <ToolTipChip
        left="true"
        title="W.I.P"
        width="300"
        tooltip="The search header is currently a work in progress and hasn't had all the functionality added to it yet. In the coming weeks search and filtration will become available giving you the ability to sort through your tasks fairly easily."
      />
      <v-spacer />
      <v-btn disabled>
        <v-icon>mdi-filter-variant</v-icon>
      </v-btn>
      <v-text-field
        v-model="search"
        disabled
        class="mx-4"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        placeholder="Not quite ready yet, still cooking"
      />
      <TaskForm />
    </v-toolbar>
    <!-- 
      <v-card-subtitle></v-card-subtitle>
      <v-card-actions>
        <v-btn text>
          Feeling Lucky
        </v-btn>
      </v-card-actions>
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
      </v-app-bar> -->
    <!-- </v-card> -->
  </v-card>
</template>

<script>
import TaskForm from '@/components/task/TaskForm'
import ToolTipChip from '@/components/chips/ToolTipChip'

export default {
  name: 'SearchHeader',
  components: {
    TaskForm,
    ToolTipChip
  },
  data: () => ({
    search: ''
  })
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
