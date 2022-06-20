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
    this.getUser.subscribe(user => this.user = user)
  },
  computed: {
    layout() {
      return this.$route.meta.layout || 'DefaultLayout'
    },
    ...mapState('notification', ['alerts']),
    ...mapGetters('account', ['getUser', 'getUserValue']),
  },
  methods: {
    ...mapActions('account', ['getById']),
    ...mapActions('notification', ['clearAlerts'])
  },
  watch: {
    $route() {
      if (this.alerts.length) this.clearAlerts()
    }
  }
};
</script>
<style>
.v-slide-group div div div {
  justify-content: center;
}
.custom-link:hover {
  text-decoration: underline;
}
.input-number input {
  text-align: center;
}
.chip-item span {
  width: 150px;
  justify-content: center;
}
.chip-group div {
  justify-content: center;
}
.v-slider__thumb {
  cursor: grab;
}
</style>
