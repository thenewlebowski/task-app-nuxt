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
              <v-list-item-title class="d-flex align-items-center"
                >{{ item.text
                }}<v-chip v-if="item.new" color="success"
                  ><v-icon small>mdi-alert-decagram</v-icon>New
                </v-chip></v-list-item-title
              >
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
      <NoEmailPrompt />
      <v-container fluid class="overflow-auto">
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
        text: 'Page search',
        icon: 'mdi-account-search',
        route: '/page-search',
        new: true
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
html {
  overflow-y: auto !important;
}
</style>
<style scoped>
.container {
  position: absolute;
  bottom: 0;
  top: 0;
}
.v-list-item__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
