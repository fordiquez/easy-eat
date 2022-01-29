<template>
  <div>
    <h2 v-if="user">Hola, {{ user.firstName }}!</h2>
    <p>You're logged in with Vue 3 & JWT!</p>
    <button @click="onLogout" class="btn btn-primary">Logout</button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: "Home",
  data() {
    return {
      user: null
    }
  },
  created() {
    this.getUser.subscribe(user => this.user = user)
  },
  computed: {
    ...mapGetters('account', ['getUser']),
  },
  methods: {
    ...mapActions('account', ['logout']),
    async onLogout() {
      await this.logout().then(async () => {
        await this.$router.push({ name: 'Login' });
      })
    },
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
