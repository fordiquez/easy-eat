<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" :mini-variant="miniVariant" app fixed>
      <v-list-item class="d-flex justify-center align-center">
        <v-list-item-avatar>
          <v-img alt="Logo" title="Logo" :src="require('@/assets/logo.svg')" />
        </v-list-item-avatar>
        <v-list-item-content class="pl-2" v-if="!miniVariant">
          <v-list-item-title class="text-h4 text-uppercase" style="user-select: none">
            <strong class="mr-1 font-weight-black">Easy</strong>
            <span class="success--text">Eat</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list nav dense flat>
        <v-list-item-group v-model="selectedItem" :value="selectedItem" color="success">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" link exact>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-2" v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-3" v-if="user">
          <v-btn :block="!miniVariant" :icon="miniVariant" :loading="status.loading" @click="onLogout">
            <v-icon class="success--text" :large="miniVariant">mdi-exit-to-app</v-icon>
            <span class="ma-2 success--text" v-if="!miniVariant">Logout</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" app fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Alert v-if="status.error || status.success || status.info" />
        <router-view />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" fixed temporary>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer class="d-flex justify-center align-center" :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} — <strong>{{ title }}</strong></span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import Alert from "@/components/Alert";

export default {
  name: 'DefaultLayout',
  components: { Alert },
  props: {
    user: {
      type: [Object, Boolean],
      default: null
    }
  },
  data: () => ({
    selectedItem: 0,
    clipped: false,
    drawer: false,
    fixed: false,
    items: [
      { icon: 'mdi-circle-half-full', title: 'Dashboard', to: '/' },
      { icon: 'mdi-flower-tulip-outline', title: 'Log In', to: '/account/login' },
      { icon: 'mdi-movie-play-outline', title: 'Sign Up', to: '/account/register' },
      { icon: 'mdi-chart-gantt', title: 'Account recovery', to: '/account/forgot-password' },
      { icon: 'mdi-account-music-outline', title: 'Reset Password', to: '/account/reset-password' },
      { icon: 'mdi-flash-auto', title: 'Email Verification', to: '/account/verify-email' },
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: 'EasyEat'
  }),
  computed: {
    ...mapState('alert', ['status']),
    ...mapGetters('account', ['getUser', 'getUserValue'])
  },
  methods: {
    ...mapActions('account', ['logout']),
    async onLogout() {
      await this.logout().then(async () => {
        await this.$router.push({ name: 'Login' });
      })
    }
  }
}
</script>
