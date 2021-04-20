<template v-slot:default="props">
    <!--            <v-card>-->
    <!--                <v-card-title class="subheading font-weight-bold">{{-->
    <!--                    task.name-->
    <!--                }}</v-card-title>-->

    <!--                <v-divider></v-divider>-->

    <!--                <v-list dense>-->
    <!--                    <v-list-item-->
    <!--                        v-for="(key, index) in filteredKeys"-->
    <!--                        :key="index"-->
    <!--                        :color="-->
    <!--                            sortBy === key ? `#385F73 lighten-4` : `white`-->
    <!--                        "-->
    <!--                    >-->
    <!--                        <v-list-item-content>{{ key }}:</v-list-item-content>-->
    <!--                        <v-list-item-content class="align-end">{{-->
    <!--                            task[key.toLowerCase()]-->
    <!--                        }}</v-list-item-content>-->
    <!--                    </v-list-item>-->
    <!--                </v-list>-->
    <!--            </v-card>-->
    <v-card @click="taskView = true" outlined>
        <v-list-item>
            <v-list-item-content class="row">
                <SiteChip :site="task.site" class="col" />
                <TypeChip :type="task.type" class="col" />
                <PriorityChip :priority="task.priority" class="col" />
                <v-list-item-title
                    v-text="task.title"
                    class="headline col-4"
                ></v-list-item-title>
                <v-list-item-subtitle
                    v-text="task.description"
                    class="col-3"
                ></v-list-item-subtitle>
                <PointsChip :points="task.points" class="col" />
                <ReporterChip :reporter="task.reporter" class="col" />
            </v-list-item-content>
        </v-list-item>

        <!--                <v-card-actions>-->
        <!--                    <EditTaskForm v-bind="task" />-->
        <!--                    <DeleteTaskModal v-bind="task" />-->
        <!--                </v-card-actions>-->
    </v-card>
</template>

<script>
// import EditTaskForm from './EditTaskForm'
// import DeleteTaskModal from './DeleteTaskModal'
import SiteChip from './chips/SiteChip'
import TypeChip from './chips/TypeChip'
import PriorityChip from './chips/PriorityChip'
import PointsChip from './chips/PointsChip'
import ReporterChip from './chips/ReporterChip'

export default {
    components: {
        // EditTaskForm,
        // DeleteTaskModal,
        SiteChip,
        TypeChip,
        PriorityChip,
        PointsChip,
        ReporterChip
    },
    props: {
        task: Object
    },
    data: () => ({
        keys: [
            'Title',
            'Site',
            'Reporter',
            'Type',
            'Points',
            'Priority',
            'Description',
            'Date'
        ],
        taskView: false
    }),
    computed: {
        filteredKeys() {
            return this.keys.filter((key) => key !== `Title`)
        }
    }
}
</script>
