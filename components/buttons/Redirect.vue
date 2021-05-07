<template>
  <div :style="contStyle">
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <NuxtLink :to="url">
          <v-btn v-on="on" v-bind="attrs" :style="btnStyle" :color="color" fab
            ><v-chip v-if="chip" :style="chipStyle" color="success">{{
              chipText
            }}</v-chip
            ><v-icon>{{ icon }}</v-icon>
          </v-btn>
        </NuxtLink>
      </template>
      <div>{{ tooltip }}</div>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    contStyle: {
      type: Object,
      default: () => {}
    },
    btnStyle: {
      type: Object,
      default: () => {}
    },
    chipStyle: {
      type: Object,
      default: () => {}
    },
    // redirects to given url
    url: {
      default: '/',
      type: String
    },
    icon: {
      default: 'mdi-android-auto',
      type: String
    },
    chip: {
      default: false,
      type: Boolean
    },
    chipText: {
      default: 'text',
      type: String
    },
    tooltip: {
      default: 'tooltip',
      type: String
    },
    color: {
      type: String,
      default: '#385F73'
    }
  }
}
</script>

<style></style>
