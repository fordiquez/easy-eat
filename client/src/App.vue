<template>
  <component :user="user" :is="layout" />
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { getCookie } from "@/utils/storage"
import DefaultLayout from "@/layouts/default"

export default {
  name: 'app',
  components: { DefaultLayout },
  data() {
    return {
      user: null
    }
  },
  created() {
    this.getUser.subscribe(user => this.user = user)
  },
  mounted() {
    const cookie = getCookie('refreshToken')
    console.log('refreshToken cookie: ' + cookie)
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
