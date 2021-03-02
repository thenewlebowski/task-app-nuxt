<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-layout justify-space-between column class="fill-height">
        <v-list subheader>
          <v-subheader inset>Tasks</v-subheader>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="$router.push(item.route)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list footer>
          <ThemeSwitcher class="float-end" />
        </v-list>
      </v-layout>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
      <v-spacer />
      <AvatarMenu v-if="$auth.loggedIn" />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import ThemeSwitcher from '@/components/ThemeSwitcher'
import NoEmailPrompt from '@/components/NoEmailPrompt'
import AvatarMenu from '../components/AvatarMenu'
export default {
  components: {
    ThemeSwitcher,
    NoEmailPrompt,
    AvatarMenu
  },
  data: () => ({
    drawer: null,
    title: 'gogrello',
    items: [
      {
        text: 'Mine',
        icon: 'mdi-view-dashboard',
        route: '/'
      },
      {
        text: 'Unassigned',
        icon: 'mdi-magnify-plus',
        route: '/unassigned'
      },
      {
        text: 'Assigned',
        icon: 'mdi-magnify-plus',
        route: '/assigned'
      },
      {
        text: 'Archived',
        icon: 'mdi-archive',
        route: '/archived'
      }
    ]
  })
}
</script>

<style>
a,
u {
  text-decoration: none;
}
ol,
ul,
li {
  list-style: none;
}
</style>
