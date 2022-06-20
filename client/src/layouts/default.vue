<template>
  <v-app>
    <v-navigation-drawer v-model="application.drawer" @input="drawer" :clipped="application.clipped" :mini-variant="application.miniVariant" app fixed>
      <v-list-item class="d-flex justify-center align-center" @click="logoNav">
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
              <v-icon v-text="route.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-2" v-text="route.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider v-if="isAdminRole" />
        <v-list-group v-if="isAdminRole" prepend-icon="mdi-account-cowboy-hat" :value="isActiveAdminRoute">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-2">Admin Panel</v-list-item-title>
            </v-list-item-content>
          </template>
            <v-list-item v-for="(route, index) in routes.admins" :key="index" :to="{ name: route.to }" link exact class="ml-14">
              <v-list-item-title v-text="route.title" />
              <v-list-item-icon>
                <v-icon v-text="route.icon" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-flex v-if="user && !application.miniVariant" class="d-flex flex-column align-center justify-center">
          <v-avatar size="150">
            <v-img v-if="avatarPath" :src="avatarPath" :lazy-src="avatarPath" :alt="fullName" :title="fullName" />
            <v-icon v-else color="success" size="100">mdi-account-circle</v-icon>
          </v-avatar>
          <v-card-title class="text-button py-2">{{ user.firstName }} {{ user.lastName }}</v-card-title>
        </v-flex>
        <v-flex class="pa-3" v-if="user">
          <v-btn :block="!application.miniVariant" :icon="application.miniVariant" :loading="loading" @click="onLogout">
            <v-icon class="success--text" :large="application.miniVariant">mdi-logout</v-icon>
            <span class="ma-2 success--text" v-if="!application.miniVariant">Logout</span>
          </v-btn>
        </v-flex>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="application.clipped" app fixed>
      <v-app-bar-nav-icon @click.stop="onDrawer" />
      <v-btn icon @click.stop="onMiniVariant">
        <v-icon>mdi-{{ `chevron-${application.miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="!user" v-show="$vuetify.breakpoint.smAndUp" :to="{ name: 'Login' }" active-class="success--text" text>Log In</v-btn>
      <v-btn v-if="!user" v-show="$vuetify.breakpoint.smAndUp" :to="{ name: 'Register' }" active-class="success--text" text>Sign Up</v-btn>
      <v-menu v-if="user" bottom left offset-y>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom color="success">
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
      <v-tooltip bottom color="success">
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
      <v-flex class="d-flex pa-3">
        <h5 class="text-h6">Settings</h5>
        <v-spacer />
        <v-btn icon @click.stop="onRightDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-flex>
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
      type: Object,
      default: null
    }
  },
  data: () => ({
    application: null,
    rightDrawer: false,
    loading: false,
    selectedItem: 0,
    title: process.env.VUE_APP_TITLE,
    routes: {
      drawer: [
        { icon: 'mdi-math-log', title: 'Daily Log', to: 'DailyLog' },
        { icon: 'mdi-debug-step-over', title: 'Onboarding', to: 'Onboarding' },
        { icon: 'mdi-file-document-edit', title: 'Meal Plan', to: 'MealPlan' }
      ],
      admins: [
        { icon: 'mdi-account-group-outline', title: 'Users', to: 'Users' },
        { icon: 'mdi-file-document-multiple', title: 'Meal Plans', to: 'MealPlans' }
      ],
      account: [
        { icon: 'mdi-account-details', title: 'My Profile', to: 'Profile' },
        { icon: 'mdi-account-lock-open', title: 'Account Settings', to: 'Account' },
        { icon: 'mdi-application-cog', title: 'App Settings', to: 'App' },
      ]
    },
  }),
  created() {
    this.init()
    this.application = this.getApplication
    if (this.user?.id) this.getById(this.user.id)
  },
  computed: {
    ...mapState('notification', ['alerts', 'snackbars']),
    ...mapGetters('account', ['getUser', 'getUserValue']),
    ...mapGetters('application', ['getApplication']),
    isActiveAlert() {
      return !!this.alerts.find(alert => alert.active)
    },
    isActiveSnackbar() {
      return !!this.snackbars.find(snackbar => snackbar.active && snackbar.createdAt > new Date().getTime() - 5000)
    },
    isAdminRole() {
      return this.user?.role === 'Admin'
    },
    isActiveAdminRoute() {
      return this.$route.meta.authorized?.includes('Admin')
    },
    avatar() {
      return this.user?.avatar?.filename
    },
    avatarPath() {
      return this.user?.avatar?.filename ? `${process.env.VUE_APP_BASE_API_URL}${process.env.VUE_APP_ACCOUNT_AVATAR_PATH}/${this.user.id}/${this.user.avatar.filename}` : null
    },
    fullName() {
      return this.user?.firstName + ' ' + this.user?.lastName
    }
  },
  methods: {
    ...mapActions('account', ['getById', 'logout']),
    ...mapActions('food', ['clearUserFood']),
    ...mapActions('userData', ['clearUserData']),
    ...mapActions('mealPlan', ['clearSelectedPlan']),
    ...mapActions('application', ['init', 'update']),
    ...mapActions('notification', ['setSnackbar', 'setAlert']),
    logoNav() {
      if (this.$route.name !== 'DailyLog') this.$router.push({ name: 'DailyLog' })
    },
    onLogout() {
      this.loading = true
      this.logout().then(response => {
        this.clearUserFood()
        this.clearUserData()
        this.clearSelectedPlan()
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
