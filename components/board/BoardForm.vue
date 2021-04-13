<template>
  <v-dialog v-model="visible" width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-card>
        <v-btn v-on="on" v-bind="attrs">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card>
    </template>
    <template>
      <v-card>
        <v-container>
          <v-card-title
            ><v-row>
              <v-col class="d-flex align-center" cols="6"
                >Create New Board</v-col
              >
              <v-col cols="6">
                <div
                  v-bind:style="{ backgroundColor: color }"
                  class="board-color"
                ></div
              ></v-col> </v-row
          ></v-card-title>
          <v-row>
            <v-col cols="12">
              <v-text-field
                :error-messages="titleErrors"
                @change="$v.title.$touch()"
                @blur="$v.title.$touch()"
                v-model="title"
                :counter="25"
                label="*Title"
              />
            </v-col>
            <v-col
              cols="12"
              class="d-flex flex-row align-center justify-space-between"
            >
              <v-card-subtitle
                >Do you want to make this board public?</v-card-subtitle
              >
              <v-switch
                v-model="publicBoard"
                :label="`${publicBoard ? 'Yes' : 'No'} `"
                flat
              ></v-switch
            ></v-col>
            <v-col cols="12" class="d-flex">
              <v-card-subtitle>Pick board color</v-card-subtitle>
            </v-col>
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-color-picker
                v-model="color"
                value="#3F51B5"
                hide-canvas
                hide-inputs
                mode="hexa"
                show-swatches
                swatches-max-height="150"
              ></v-color-picker>
            </v-col>
            <v-col class="d-flex justify-space-between">
              <v-card-subtitle
                >What to change the text color too?
              </v-card-subtitle>
              <v-btn> Click here</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn @click="submit" class="btn-success" text>Add Board</v-btn>
              <v-btn @click="close" text>Close</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    title: { required, maxLength: maxLength(25) }
  },
  data() {
    return {
      visible: false,
      publicBoard: false,
      title: '',
      color: '#3F51B5'
    }
  },
  computed: {
    boardColor() {
      return this.color ? this.color.hex : this.color
    },
    titleErrors() {
      const errors = []
      if (!this.$v.title.$dirty) return errors
      !this.$v.title.required && errors.push('Board title is required')
      !this.$v.title.maxLength &&
        errors.push('Board title must be less then 25 characters long')
      return errors
    }
  },
  methods: {
    close() {
      this.visible = false
      this.title = ''
    },
    submit() {
      this.$v.$touch()
      if (this.$v.$error) return
      const payload = {
        color: this.color,
        title: this.title,
        owner: this.$auth.user._id,
        publicBoard: this.publicBoard
      }
      this.$store
        .dispatch('boards/createBoard', payload)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(res)
          }
          this.showCreateSuccess()
          this.visible = false
        })
        .catch((err) => {
          this.showCreateError()
          return err
        })
    }
  },
  notifications: {
    showCreateError: {
      title: 'Failed',
      message: 'Error creating custom board please contact system admin',
      type: 'error'
    },
    showCreateSuccess: {
      title: 'Success',
      message: 'Successfully created custom board',
      type: 'success'
    }
  }
}
</script>

<style>
.board-color {
  float: right;
  border-radius: 100%;
  width: 48px;
  height: 48px;
  transition: background-color 1s;
}
</style>
