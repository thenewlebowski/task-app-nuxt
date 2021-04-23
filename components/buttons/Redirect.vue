<template>
  <div
    :style="{
      position: 'fixed',
      bottom: '60px',
      right: '20px',
      width: '100px',
      height: '100px'
    }"
  >
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <NuxtLink :to="url">
          <v-btn
            v-on="on"
            v-bind="attrs"
            :style="{ 'border-radius': '100%' }"
            color="#385F73"
            height="100%"
            width="100%"
            ><v-chip
              v-if="chip"
              :style="{ position: 'absolute', top: '-185%', right: '-30%' }"
              color="success"
              >{{ chipText }}</v-chip
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
    }
  }
}
</script>

<style></style>
