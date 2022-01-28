<template>
  <div class="card">
    <div class="card-header">
      <h3>Email Verification</h3>
    </div>
    <div class="card-body">
      <div v-if="status.loading" class="d-flex justify-content-center align-items-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Verifying...</span>
        </div>
        <span class="h5 mb-0 ms-2">Verifying...</span>
      </div>
      <span v-else-if="status.success">Verification successful, you can now login.</span>
      <div v-else>
        Verification failed, you can also verify your account using the
        <router-link :to="{ name: 'ForgotPassword' }" class="link-primary text-decoration-none">forgot password</router-link>
        page.
      </div>
    </div>
  </div>

</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "VerifyEmail",
  mounted() {
    this.verify()
  },
  computed: {
    ...mapState('account', ['status', 'response'])
  },
  methods: {
    ...mapActions({
      verifyEmail: 'account/verifyEmail',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async verify() {
      const { token } = this.$route.query
      await this.$router.replace(location.pathname)
      console.log(token)
      await this.verifyEmail(token).then(async () => {
        if (this.status.success) {
          await this.$router.push({ name: 'Login' })
          await this.success(this.response)
        } else {
          await this.error(this.response)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
