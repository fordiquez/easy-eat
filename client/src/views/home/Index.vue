<template>
  <div>
    <h2 v-if="user">Hola, {{ user.firstName }}!</h2>
    <p>You're logged in with Vue 3 & JWT!</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Home",
  data() {
    return {
      user: null,
      query: ''
    }
  },
  created() {
    this.getUser.subscribe(user => this.user = user)
  },
  mounted() {
  },
  computed: {
    ...mapGetters('account', ['getUser']),
  },
  methods: {
    ...mapActions({
      logout: 'account/logout',
      search: 'product/search'
    }),
    async onLogout() {
      await this.logout().then(async () => {
        await this.$router.push({ name: 'Login' });
      })
    },
    async nutritionAnalysis() {
      const options = {
        params: {
          ingr: this.query
        }
      }
      await this.search(options).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    }
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
