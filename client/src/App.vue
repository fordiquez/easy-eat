<template>
  <component :user="user" :is="layout" />
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import DefaultLayout from "@/layouts/default"

export default {
  name: 'app',
  components: { DefaultLayout },
  data: () => ({
    user: null
  }),
  created() {
    // console.log(window.matchMedia("(prefers-color-scheme: light)").matches)
    this.getUser.subscribe(user => this.user = user)
  },
  computed: {
    layout() {
      return this.$route.meta.layout || 'DefaultLayout'
    },
    ...mapState('notification', ['alerts']),
    ...mapGetters('account', ['getUser']),
  },
  methods: {
    ...mapActions('notification', ['clearAlerts'])
  },
  watch: {
    $route() {
      this.alerts.length ? this.clearAlerts() : null
    }
  }
};
</script>
