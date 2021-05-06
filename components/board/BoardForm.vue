<template>
  <v-dialog v-model="visible" width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-on="on"
        v-bind="attrs"
        :color="editting ? color : null"
        fab
        elevation="10"
        depressed
      >
        <v-icon>{{ editting ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
      </v-btn>
    </template>
    <template>
      <v-card>
        <v-container>
          <v-card-title
            ><v-row>
              <v-col class="d-flex align-center" cols="6">{{
                editting ? `Edit '${tempTitle}'` : 'Create New Board'
              }}</v-col>
              <v-col cols="6">
                <div
                  v-bind:style="{ backgroundColor: tempColor }"
                  class="board-color"
                ></div
              ></v-col> </v-row
          ></v-card-title>
          <v-row>
            <v-col cols="12">
              <v-text-field
                :error-messages="tempTitleErrors"
                @change="$v.tempTitle.$touch()"
                @blur="$v.tempTitle.$touch()"
                v-model="tempTitle"
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
                v-model="tempPublic"
                :label="`${tempPublic ? 'Yes' : 'No'} `"
                flat
              ></v-switch
            ></v-col>
            <v-col cols="12" class="d-flex">
              <v-card-subtitle>Pick board color</v-card-subtitle>
            </v-col>
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-color-picker
                v-model="tempColor"
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
              <v-btn @click="submit" class="btn-success" text>Submit</v-btn>
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
    tempTitle: { required, maxLength: maxLength(25) }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    publicBoard: {
      type: Boolean,
      default: false
    },
    editting: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#3F51B5'
    }
  },
  data() {
    return {
      visible: false,
      // work around so we don't mutate the props
      tempPublic: this.publicBoard,
      tempTitle: this.title,
      tempColor: this.color
    }
  },
  computed: {
    boardColor() {
      return this.tempColor ? this.tempColor.hex : this.tempColor
    },
    tempTitleErrors() {
      const errors = []
      if (!this.$v.tempTitle.$dirty) return errors
      !this.$v.tempTitle.required && errors.push('Board title is required')
      !this.$v.tempTitle.maxLength &&
        errors.push('Board tempTitle must be less then 25 characters long')
      return errors
    }
  },
  methods: {
    close() {
      this.visible = false
      this.tempTitle = this.publicBoard
      this.tempTitle = this.title
      this.tempColor = this.color
      this.tempPublic = this.public
    },
    edit(payload) {
      this.$store
        .dispatch('boards/updateBoard', payload)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(res)
          }
          this.showUpdateSuccess()
          this.visible = false
        })
        .catch((err) => {
          this.showUpdateError()
          return err
        })
    },
    add(payload) {
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
    },
    submit() {
      this.$v.$touch()
      if (this.$v.$error) return

      const payload = {
        color: this.tempColor,
        title: this.tempTitle,
        owner: this.$auth.user._id,
        publicBoard: this.tempPublicBoard
      }

      // if currently editting submit existing date
      if (this.editting) {
        delete payload.owner
        payload.board = this.id
        return this.edit(payload)
      } else {
        return this.add(payload)
      }
    }
  },
  notifications: {
    showUpdateSuccess: {
      title: 'Success',
      message: 'Successfully updated board',
      type: 'success'
    },
    showUpdateError: {
      title: 'Failed',
      message: 'Failed to update board, please contact system admin',
      type: 'error'
    },
    showCreateError: {
      title: 'Failed',
      message: 'Error creating custom board, please contact system admin',
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
