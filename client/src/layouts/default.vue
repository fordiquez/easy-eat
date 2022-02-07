<template>
  <v-app dark>
    <v-navigation-drawer v-model="application.drawer" :clipped="application.clipped" :mini-variant="application.miniVariant" app fixed>
      <v-list-item class="d-flex justify-center align-center">
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
          <v-list-item v-for="(route, i) in routes" :key="i" :to="route.to" link exact>
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
          <v-btn :block="!application.miniVariant" :icon="application.miniVariant" :loading="status.loading" @click="onLogout">
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
      <v-btn icon @click.stop="onClipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="onFixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="onRightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Alert v-if="status.error || status.success || status.info" />
        <router-view />
      </v-container>
    </v-main>
<!--    <v-navigation-drawer v-model="application.rightDrawer" :right="application.right" fixed temporary>-->
<!--      <v-list>-->
<!--        <v-list-item @click.native="onRight">-->
<!--          <v-list-item-action>-->
<!--            <v-icon light>-->
<!--              mdi-repeat-->
<!--            </v-icon>-->
<!--          </v-list-item-action>-->
<!--          <v-list-item-title>Switch drawer</v-list-item-title>-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
    <v-footer class="d-flex justify-center align-center" :absolute="!application.fixed" app>
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
    application: {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    },
    selectedItem: 0,
    title: 'EasyEat',
    routes: [
      { icon: 'mdi-circle-half-full', title: 'Dashboard', to: '/' },
      { icon: 'mdi-flower-tulip-outline', title: 'Log In', to: '/account/login' },
      { icon: 'mdi-movie-play-outline', title: 'Sign Up', to: '/account/register' },
      { icon: 'mdi-chart-gantt', title: 'Account recovery', to: '/account/forgot-password' },
      { icon: 'mdi-account-music-outline', title: 'Reset Password', to: '/account/reset-password' },
      { icon: 'mdi-flash-auto', title: 'Email Verification', to: '/account/verify-email' },
    ],
  }),
  async created() {
    await this.init()
    this.application = this.getApplication
  },
  computed: {
    ...mapState('alert', ['status']),
    ...mapGetters({
      getUser: 'account/getUser',
      getUserValue: 'account/getUserValue',
      getApplication: 'application/getApplication'
    })
  },
  methods: {
    ...mapActions({
      logout: 'account/logout',
      init: 'application/init',
      update: 'application/update'
    }),
    async onLogout() {
      await this.logout().then(async () => {
        this.$route.name !== 'Login' ? await this.$router.push({ name: 'Login' }) : null
      })
    },
    onClipped() {
      this.application.clipped = !this.application.clipped
      this.update(this.application)
    },
    onDrawer() {
      this.application.drawer = !this.application.drawer
      this.update(this.application)
    },
    onFixed() {
      this.application.fixed = !this.application.fixed
      this.update(this.application)
    },
    onMiniVariant() {
      this.application.miniVariant = !this.application.miniVariant
      this.update(this.application)
    },
    onRight() {
      this.application.right = !this.application.right
      this.update(this.application)
    },
    onRightDrawer() {
      this.application.rightDrawer = !this.application.rightDrawer
      this.update(this.application)
    }
  }
}
</script>
