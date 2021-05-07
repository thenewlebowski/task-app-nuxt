<template>
  <v-card>
    <v-container>
      <v-row dense>
        <v-container>
          <v-col cols="12">
            <v-card :color="task.board.color" dark style="padding:5px">
              <div class="d-flex align-center justify-space-between">
                <v-app-bar dark elevation="5">
                  <v-btn>
                    <v-icon>mdi-settings</v-icon>
                  </v-btn>

                  <v-card-title v-text="task.title" class="text-h5" />

                  <v-spacer></v-spacer>

                  <v-btn>
                    <v-icon>mdi-message</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-notebook</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-bell</v-icon>
                  </v-btn>
                </v-app-bar>
              </div>
              <v-card>
                <v-card-subtitle v-text="task.description"></v-card-subtitle>
              </v-card>
              <v-container>
                <v-card
                  cols="12"
                  class="d-flex text-center"
                  width="75%"
                  style="margin:auto"
                >
                  <v-card-text
                    v-text="
                      'Due Date: ' + (task.dateDue ? task.dateDue : 'None')
                    "
                    class="text-h6"
                  />
                  <v-card-text
                    v-text="'Points: ' + task.points"
                    class="text-h6"
                  />
                  <v-card-text
                    v-text="'Reporter: ' + reporter"
                    class="text-h6"
                  />
                </v-card>
              </v-container>
              <v-container>
                <v-card
                  cols="12"
                  class="d-flex text-center"
                  style="margin:auto"
                  width="75%"
                >
                  <v-card-text
                    v-text="'Priority: ' + task.priority"
                    class="text-h6"
                  />
                  <v-card-text
                    v-text="'Archived: ' + (task.archived ? true : false)"
                    class="text-h6"
                  />
                  <v-card-text v-text="'Type: ' + task.type" class="text-h6" />
                </v-card>
              </v-container>
              <v-container>
                <v-card
                  cols="12"
                  class="d-flex text-center"
                  width="75%"
                  style="margin:auto"
                >
                  <v-card-text
                    v-text="
                      'Completion Date: ' +
                        (task.dateCompleted ? task.dateCompleted : 'None')
                    "
                    class="text-h6"
                  />
                  <v-card-text
                    v-text="'Assignee: ' + assignee"
                    class="text-h6"
                  />
                  <v-card-text
                    v-text="'Status: ' + task.status"
                    class="text-h6"
                  />
                </v-card>
              </v-container>
            </v-card>
          </v-col>
        </v-container>
        <v-col cols="12">
          <v-container>
            <v-card color="secondary" dark>
              <v-card-text
                v-text="'Additional Information (Coming Soon)'"
                class="text-right text-h5"
              />
            </v-card>
          </v-container>
          <v-container>
            <v-card color="secondary" dark>
              <v-card-text
                v-text="'Comments (Coming Soon)'"
                class="text-left text-h5"
              />
            </v-card>
          </v-container>
          <v-container>
            <v-card color="secondary" dark>
              <v-card-text
                v-text="'Recent Activity (Coming Soon)'"
                class="text-right text-h5"
              />
            </v-card>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'TaskInfo',
  //   data() {
  //     return {
  //       task: this.$store.state.tasks.focus // ._id
  //     }
  //   },
  computed: {
    board() {
      return this.$store.state.tasks.focus.board
    },
    task() {
      return this.$store.state.tasks.focus
    },
    assignee() {
      return this.task.assignee
        ? this.$store.getters['user/getUsersNameAndIdKey'][this.task.assignee]
            .username
        : 'None'
    },
    reporter() {
      return this.task.reporter
        ? this.$store.getters['user/getUsersNameAndIdKey'][this.task.reporter]
            .username
        : 'None'
    }
  }
}
</script>

<style></style>
