<template>
  <v-card v-if="error" :loading="loading" rounded>
    <v-card-title>Email verification</v-card-title>
    <v-card-subtitle class="pb-0">Verification failed</v-card-subtitle>
    <v-card-text class="text--primary text-button">
      <span>if you don't have a verification token try to restore the account using the</span>
      <v-btn text plain color="success" :to="{ name: 'ForgotPassword' }">forgot password</v-btn>
      <span>page</span>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="success" :to="{ name: 'Login' }">
        <v-icon class="mr-1">mdi-login</v-icon>
        <span>Log In</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "VerifyEmail",
  data: () => ({
    loading: false,
    error: false
  }),
  mounted() {
    const { token } = this.$route.query
    this.verify(token)
  },
  methods: {
    ...mapActions({
      verifyEmail: 'account/verifyEmail',
      setAlert: 'notification/setAlert',
      setSnackbar: 'notification/setSnackbar'
    }),
    verify(token) {
      if (token) {
        this.$router.replace(location.pathname).then(() => {
          this.verifyEmail(token).then(response => {
            console.log(response)
            this.$router.push({ name: 'Login' }).then(() => {
              this.setAlert({ type: 'success', text: response.data.message })
              this.setSnackbar({ color: 'success', text: response.data.message })
            })
          }).catch(error => {
            console.log(error.response)
            if (error.response.data.message === 'Account has already been verified') {
              this.setAlert({ type: 'info', text: error.response.data.message })
              this.setSnackbar({ color: 'info', text: error.response.data.message })
            } else {
              this.setAlert({ type: 'error', text: error.response.data.message })
              this.setSnackbar({ color: 'error', text: error.response.data.message })
              this.error = true
            }
          })
        })
      } else {
        this.setAlert({ type: 'error', text: 'Verification token not provided' })
        this.setSnackbar({ color: 'error', text: 'Verification token not provided' })
        this.error = true
      }
    }
  }
}
</script>
