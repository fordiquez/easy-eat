<template>
  <v-card>
    <v-toolbar color="success">
      <v-toolbar-title>My Settings</v-toolbar-title>
    </v-toolbar>
    <v-tabs grow show-arrows>
      <v-tab :to="{ name: 'Profile' }">
        <v-icon left>mdi-account-details</v-icon>
        <span>My Profile</span>
      </v-tab>
      <v-tab :to="{ name: 'Account' }">
        <v-icon left>mdi-account-lock-open</v-icon>
        Account Settings
      </v-tab>
      <v-tab :to="{ name: 'App' }">
        <v-icon left>mdi-application-cog</v-icon>
        <span>App Settings</span>
      </v-tab>
    </v-tabs>
    <router-view :user="user" />
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Settings",
  data: () => ({
    user: null,
  }),
  created() {
    this.user = this.getUserValue
    this.getCurrentUser()
  },
  computed: {
    ...mapGetters('account', ['getUser', 'getUserValue'])
  },
  methods: {
    ...mapActions('account', ['getById']),
    getCurrentUser() {
      this.getById(this.user.id).then((response) => {
        console.log(response)
        this.getUser.subscribe(user => this.user = user)
      }).catch(error => {
        console.log(error.response)
      })
    }
  }
}
</script>
