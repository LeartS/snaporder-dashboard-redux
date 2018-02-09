<template>
<div>
  <v-navigation-drawer absolute floating light app v-model="drawer">
    <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Lista domande
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>add_box</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Nuova domanda
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar color="amber lighten-1" app>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>SnapOrder Questions Panel</v-toolbar-title>
  </v-toolbar>
  <v-content>
    <v-container class="pt-0 xs-px-0">
      <router-view></router-view>
    </v-container>
  </v-content>
</div>
</template>

<script>
export default {
  name: 'Dashboard',
  data: () => ({
    drawer: false,
  })
}
</script>
