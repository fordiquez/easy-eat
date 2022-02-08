<template>
  <component :user="user" :is="layout" />
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
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
    // this.user = this.getUserValue
  },
  mounted() {
    const cookie = getCookie('refreshToken')
    console.log('refreshToken cookie: ' + cookie)
  },
  computed: {
    layout() {
      return this.$route.meta.layout || 'DefaultLayout'
    },
    ...mapState({
      alert: state => state.alert,
    }),
    ...mapGetters('account', ['getUser', 'getUserValue']),
  },
  methods: {
    ...mapActions('notifications', ['clearAlerts'])
  },
  watch: {
    $route() {
      this.clearAlerts()
    }
  }
};
</script>
