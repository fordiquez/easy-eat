<template>
  <v-card>
    <v-toolbar color="success">
      <v-toolbar-title>Admin Panel</v-toolbar-title>
    </v-toolbar>
    <v-tabs grow show-arrows>
      <v-tab :to="{ name: 'Users' }">
        <v-icon left>mdi-account-group-outline</v-icon>
        <span>Users</span>
      </v-tab>
      <v-tab :to="{ name: 'MealPlans' }">
        <v-icon left>mdi-file-document-multiple</v-icon>
        <span>Meal Plans</span>
      </v-tab>
    </v-tabs>
    <router-view :user="user" />
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Admin",
  data: () => ({
    user: null,
  }),
  created() {
    this.user = this.getUserValue
    // this.getCurrentUser()
  },
  computed: {
    ...mapGetters('account', ['getUser', 'getUserValue'])
  },
  methods: {
    ...mapActions('account', ['getById']),
    getCurrentUser() {
      this.getById(this.user.id).then(() => {
        this.getUser.subscribe(user => this.user = user)
      }).catch(error => {
        console.log(error.response)
      })
    }
  }
}
</script>
