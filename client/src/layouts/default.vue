<template>
  <v-app dark>
    <v-navigation-drawer v-model="application.drawer" @input="drawer" :clipped="application.clipped" :mini-variant="application.miniVariant" app fixed>
      <v-list-item class="d-flex justify-center align-center" @click.native="logoNav">
        <v-list-item-avatar>
          <v-img alt="Logo" title="Logo" :src="require('@/assets/logo.svg')" />
        </v-list-item-avatar>
        <v-list-item-content class="pl-2" v-if="!application.miniVariant">
          <v-list-item-title class="text-h4 text-uppercase" style="user-select: none">
            <strong class="mr-1 font-weight-black">Easy</strong>
            <span class="success--text">Eat</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list nav dense flat>
        <v-list-item-group v-model="selectedItem" :value="selectedItem" color="success">
          <v-list-item v-for="(route, index) in routes.drawer" :key="index" :to="{ name: route.to }" link exact>
            <v-list-item-icon>
              <v-icon v-text="route.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-2" v-text="route.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-3" v-if="user">
          <v-btn :block="!application.miniVariant" :icon="application.miniVariant" :loading="loading" @click="onLogout">
            <v-icon class="success--text" :large="application.miniVariant">mdi-exit-to-app</v-icon>
            <span class="ma-2 success--text" v-if="!application.miniVariant">Logout</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="application.clipped" app fixed>
      <v-app-bar-nav-icon @click.stop="onDrawer" />
      <v-btn icon @click.stop="onMiniVariant">
        <v-icon>mdi-{{ `chevron-${application.miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="!user" :to="{ name: 'Login' }" active-class="success--text" text>Log In</v-btn>
      <v-btn v-if="!user" :to="{ name: 'Register' }" active-class="success--text" text>Sign Up</v-btn>
      <v-menu v-if="user" bottom left offset-y>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn v-bind="attrs" v-on="{ ...tooltip, ...menu }" icon active-class="success--text">
                <v-icon>mdi-account-cog-outline</v-icon>
              </v-btn>
            </template>
            <span>Account</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in routes.account" :key="index" :to="{ name: item.to }" active-class="success--text" link exact dense>
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-2" v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click.stop="onRightDrawer" icon>
            <v-icon v-bind="attrs" v-on="on">mdi-cog-outline</v-icon>
          </v-btn>
        </template>
        <span>Settings</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <v-container>
        <Alert v-if="isActiveAlert" />
        <Snackbar v-if="isActiveSnackbar" />
        <router-view :user="user" />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" right temporary hide-overlay fixed>
      <div class="d-flex pa-3">
        <h5 class="text-h6">Settings</h5>
        <v-spacer />
        <v-btn icon @click.stop="onRightDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider />
      <SettingsDrawer :application="application" />
    </v-navigation-drawer>
    <v-footer class="d-flex justify-center align-center" :absolute="!application.fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} — <strong>{{ title }}</strong></span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Alert from "@/components/Alert";
import Snackbar from "@/components/Snackbar";
import SettingsDrawer from "@/components/SettingsDrawer";

export default {
  name: 'DefaultLayout',
  components: { SettingsDrawer, Snackbar, Alert },
  props: {
    user: {
      type: [Object, Boolean],
      default: null
    }
  },
  data: () => ({
    application: {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
    },
    rightDrawer: false,
    loading: false,
    selectedItem: 0,
    title: process.env.VUE_APP_TITLE,
    routes: {
      drawer: [
        { icon: 'mdi-math-log', title: 'Daily Log', to: 'DailyLog' },
        { icon: 'mdi-clipboard-text', title: 'Onboarding', to: 'Onboarding' },
        { icon: 'mdi-file-document', title: 'Meal Plan', to: 'MealPlan' },
        { icon: 'mdi-flower-tulip-outline', title: 'Log In', to: 'Login' },
        { icon: 'mdi-movie-play-outline', title: 'Sign Up', to: 'Register' },
        { icon: 'mdi-chart-gantt', title: 'Account recovery', to: 'ForgotPassword' },
        { icon: 'mdi-account-music-outline', title: 'Reset Password', to: 'ResetPassword' },
        { icon: 'mdi-flash-auto', title: 'Email Verification', to: 'VerifyEmail' },
        { icon: 'mdi-account-group-outline', title: 'Admin Users', to: 'Users' },
      ],
      account: [
        { icon: 'mdi-account-details', title: 'My Profile', to: 'Profile' },
        { icon: 'mdi-account-lock-open', title: 'Account Settings', to: 'Account' },
        { icon: 'mdi-application-cog', title: 'App Settings', to: 'App' },
      ]
    }
  }),
  created() {
    this.init()
    this.application = this.getApplication
  },
  computed: {
    ...mapState('notification', ['alerts', 'snackbars']),
    ...mapGetters({
      getUser: 'account/getUser',
      getUserValue: 'account/getUserValue',
      getApplication: 'application/getApplication'
    }),
    isActiveAlert() {
      return !!this.alerts.find(alert => alert.active)
    },
    isActiveSnackbar() {
      return !!this.snackbars.find(snackbar => snackbar.active && snackbar.createdAt > new Date().getTime() - 5000)
    },
  },
  methods: {
    ...mapActions({
      logout: 'account/logout',
      init: 'application/init',
      update: 'application/update',
      setAlert: 'notification/setAlert',
      setSnackbar: 'notification/setSnackbar'
    }),
    logoNav() {
      if (this.$route.name !== 'DailyLog') this.$router.push({ name: 'DailyLog' })
    },
    onLogout() {
      this.loading = true
      this.logout().then(response => {
        if (this.$route.name !== 'Login') {
          this.$router.push({ name: 'Login' }).then(() => {
            this.setAlert({ type: 'success', text: response.data.message })
            this.setSnackbar({ color: 'success', text: response.data.message })
          })
        }
      }).catch(error => {
        console.log(error.response)
        this.setAlert({ type: 'error', text: error.response.data.message })
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.loading = false)
    },
    onDrawer() {
      this.application.drawer = !this.application.drawer
      this.update(this.application)
    },
    onMiniVariant() {
      this.application.miniVariant = !this.application.miniVariant
      this.update(this.application)
    },
    onRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    },
    drawer(value) {
      this.application.drawer = value
      this.update(this.application)
    }
  }
}
</script>
