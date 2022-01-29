<template>
  <div>
    <h2>My Profile</h2>
    <p v-if="user"><b>Name: </b>{{ user.firstName }} {{ user.lastName }}</p>
    <p v-if="user"><b>Email: </b>{{ user.email }}</p>
    <router-link :to="{ name: 'ProfileUpdate' }" class="btn btn-primary">Update Profile</router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      user: null
    }
  },
  created() {
    this.getUser.subscribe(user => this.user = user)
  },
  computed: {
    ...mapGetters('account', ['getUser'])
  },
}
</script>

<style scoped>

</style>
