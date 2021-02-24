<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
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
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
      <v-spacer />
      <AvatarMenu v-if="$auth.loggedIn" />
    </v-app-bar>
    <v-main>
      <NoEmailPrompt />
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
import NoEmailPrompt from '@/components/NoEmailPrompt'
import AvatarMenu from '../components/AvatarMenu'
export default {
  components: {
    NoEmailPrompt,
    AvatarMenu
  },
  data: () => ({
    drawer: null,
    title: 'Gogrello',
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
      },
      {
        text: 'Settings',
        icon: 'mdi-settings',
        route: '/settings'
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
