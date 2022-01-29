<template>
  <Nav :user="user" />
  <div class="container">
<!--    <div class="row">-->
<!--      <div class="col-sm-10 offset-sm-1 mt-5">-->
        <router-view></router-view>
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getCookie } from "@/helpers/authorization";
import Nav from "@/components/Nav";

export default {
  name: 'app',
  components: { Nav },
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
    ...mapState({
      alert: state => state.alert,
    }),
    ...mapGetters('account', ['getUser', 'getUserValue']),
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear',
      clearResponse: 'account/clear',
    }),
  },
  watch: {
    $route(to, from) {
      this.clearAlert()
      setTimeout(() => this.clearResponse(), 5000)
    }
  }
};
</script>

<style>
@import "../node_modules/bootstrap/dist/css/bootstrap.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
a {
  font-weight: bold;
  color: #2c3e50;
}
a .router-link-exact-active {
  color: #42b983;
}

</style>
