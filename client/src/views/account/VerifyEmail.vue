<template>
  <v-card v-if="!status.success" :loading="status.loading" shaped>
    <v-card-title>Email verification</v-card-title>
    <v-card-subtitle class="pb-0" v-if="status.error">Verification failed</v-card-subtitle>
    <v-card-text class="text--primary text-button" v-if="status.error">
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
import { mapActions, mapState } from "vuex";

export default {
  name: "VerifyEmail",
  async mounted() {
    const { token } = this.$route.query
    await this.verify(token)
  },
  computed: {
    ...mapState('alert', ['status', 'message'])
  },
  methods: {
    ...mapActions({
      verifyEmail: 'account/verifyEmail',
      success: 'alert/success',
      error: 'alert/error',
      info: 'alert/info'
    }),
    async verify(token) {
      if (token) {
        await this.$router.replace(location.pathname)
        await this.verifyEmail(token).then(async response => {
          console.log(response)
          if (response.status === 200) {
            await this.$router.push({ name: 'Login' })
            await this.success({ status: true, message: response.data.message })
          }
        }).catch(error => {
          console.log(error.response)
          if (error.response.data.message === 'Account has already been verified') {
            this.info({ status: true, message: error.response.data.message })
          } else {
            this.error({ status: true, message: error.response.data.message })
          }
        })
      } else {
        this.error({status: true, message: 'Verification token not provided' })
      }
    }
  }
}
</script>

<style scoped>

</style>
