<template>
  <v-menu :close-on-content-click="false" offset-y left>
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            v-bind="attrs"
            v-on="{ ...menu, ...tooltip }"
            class="float-right"
            color="primary"
            dark
          >
            <v-icon>mdi-calendar-range</v-icon>
          </v-btn>
        </template>
        <span>{{ message }}</span>
      </v-tooltip>
    </template>
    <v-row justify="center">
      <v-date-picker v-model="picker"></v-date-picker>
    </v-row>
  </v-menu>
</template>
<script>
export default {
  name: 'DatePickerDialog',
  props: {
    date: {
      type: String,
      required: false
    },
    message: {
      type: String,
      required: false,
      default: 'Add Date'
    },
    type: {
      type: String,
      required: false,
      default: 'date'
    }
  },
  data() {
    return {
      // holds a temp value until returned to parent component
      temp: this.date || null
      //   picker: Date.toISOString()
    }
  },
  computed: {
    picker: {
      get() {
        return this.temp
      },
      // transfers the choosen date back to the parent component
      set(value) {
        this.temp = value
        const payload = {
          date: value,
          type: this.type
        }
        this.$emit('update-date', payload)
      }
    }
  },
  methods: {}
}
</script>

<style></style>
