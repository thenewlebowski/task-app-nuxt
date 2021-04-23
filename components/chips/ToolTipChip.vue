<template>
  <v-tooltip
    :max-width="width"
    :bottom="bottom"
    :top="top"
    :right="right"
    :left="left"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip v-bind="attrs" v-on="on" :color="type" right>
        {{ title }}
        <v-icon class="ml-2">
          {{ icon }}
        </v-icon>
      </v-chip>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ToolTipChip',
  props: {
    left: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    width: {
      type: String || Number,
      default: ''
    },
    icon: {
      type: String,
      default: 'mdi-android'
    },
    title: {
      type: String,
      default: 'Demo'
    },
    type: {
      type: String,
      default: 'info'
    },
    tooltip: {
      type: String,
      default: 'Demo'
    }
  }
}
</script>

<style></style>
