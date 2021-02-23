<template>
  <v-switch
    @change="switchTheme"
    prepend-icon="mdi-palette"
    hint="Brad's button"
  ></v-switch>
</template>

<script>
export default {
  methods: {
    switchTheme() {
      this.$vuetify.theme.isDark = !this.$vuetify.theme.isDark
    }
  }
}
</script>
