<template>
  <v-card v-if="error" :loading="loading" shaped>
    <v-card-title>Email verification</v-card-title>
    <v-card-subtitle class="pb-0">Verification failed</v-card-subtitle>
    <v-card-text class="text--primary text-button">
      <span>if you don't have a verification token try to restore the account using the</span>
      <v-btn color="primary" :to="{ name: 'ForgotPassword' }" plain text>forgot password</v-btn>
      <span>page</span>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :to="{ name: 'Login' }" text>Sign in</v-btn>
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
  async mounted() {
    const { token } = this.$route.query
    await this.verify(token)
  },
  methods: {
    ...mapActions({
      verifyEmail: 'account/verifyEmail',
      setAlert: 'notification/setAlert',
      setSnackbar: 'notification/setSnackbar'
    }),
    async verify(token) {
      if (token) {
        await this.$router.replace(location.pathname)
        await this.verifyEmail(token).then(async response => {
          console.log(response)
          await this.$router.push({ name: 'Login' })
          await this.setAlert({ type: 'success', text: response.data.message })
          await this.setSnackbar({ color: 'success', text: response.data.message })
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
      } else {
        this.setAlert({ type: 'error', text: 'Verification token not provided' })
        this.setSnackbar({ color: 'error', text: 'Verification token not provided' })
        this.error = true
      }
    }
  }
}
</script>
