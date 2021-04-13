<template>
  <div>
    <v-card @click="taskView = true" class="mx-auto" max-width="344" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <div v-text="task.priority" class="overline mb-4"></div>
          <v-list-item-title v-text="task.title" class="headline mb-1" />
          <v-list-item-subtitle v-text="task.description" />
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-dialog v-model="taskView" max-width="600px">
      <v-card>
        <v-list-item three-line>
          <v-list-item-content>
            <div>
              <SiteChip :site="task.site" />
              <TypeChip :type="task.type" />
              <PriorityChip :priority="task.priority" />
            </div>
            <v-card-title>
              {{ task.title }}
            </v-card-title>

            <v-card-text v-text="task.description" class="mb-4" />
            <div>
              <PointsChip :points="task.points" />
              <ReporterChip :reporter="task.reporter" />
            </div>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <TaskForm :task-to-edit="task" />
          <template>
            <v-menu max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" outlined text float-right
                  >Archive
                  <v-icon v-bind="attrs" v-on="on" right>
                    mdi-xamarin
                  </v-icon></v-btn
                >
              </template>
              <template>
                <v-list :style="{ 'text-align': 'center' }">
                  <v-list-item-title>Are you sure?</v-list-item-title>
                  <v-list-item
                    v-for="(option, key) in options"
                    @click="archiveTask(option)"
                    v-bind:key="option"
                  >
                    {{ key }}
                  </v-list-item>
                </v-list>
              </template>
            </v-menu>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SiteChip from '@/components/chips/SiteChip'
import TypeChip from '@/components/chips/TypeChip'
import PriorityChip from '@/components/chips/PriorityChip'
import PointsChip from '@/components/chips/PointsChip'
import ReporterChip from '@/components/chips/ReporterChip'
import TaskForm from './TaskForm'
import ArchiveTaskModal from './ArchiveTaskModal'

export default {
  components: {
    TaskForm,
    ArchiveTaskModal,
    SiteChip,
    TypeChip,
    PriorityChip,
    PointsChip,
    ReporterChip
  },
  props: {
    task: {
      type: Object,
      default: Object
    }
  },
  data: () => ({
    options: { Yes: true, No: false },
    taskView: false
  }),
  methods: {
    archiveTask(option) {
      if (!option) return
      this.$store
        .dispatch('tasks/archiveTask', this.task._id)
        .then((res) => {
          if (res.status !== 200) throw new Error(res)
          this.taskView = false
          this.showArchiveSuccess()
        })
        .catch((err) => {
          this.showArchiveError()
          return err
        })
    }
  },
  notifications: {
    showArchiveError: {
      title: 'Failed',
      message: 'Failed to archive task please contact system admin',
      type: 'error'
    },
    showArchiveSuccess: {
      title: 'Success',
      message: 'Succesfully archived task',
      type: 'success'
    }
  }
}
</script>

<style scoped>
.v-card--link {
  cursor: move;
}
.no-wrap {
  white-space: normal;
}
</style>
