<template>
  <div class="card">
    <div class="card-header">
      <h3>Reset Password</h3>
    </div>
    <div class="card-body">
      <template v-if="status.loading" class="d-flex justify-content-center align-items-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Verifying token...</span>
        </div>
        <span class="h5 mb-0 ms-2">Verifying token...</span>
      </template>
      <h5 v-else-if="status.success">Verification successful, you can now reset your password.</h5>
      <div v-else>
        Token validation failed, if the token has expired you can get a new one at the
        <router-link :to="{ name: 'ForgotPassword' }" class="link-primary text-decoration-none">forgot password</router-link>
        page.
      </div>
      <template v-if="tokenStatus">
        <form @submit.prevent="onSubmit">
          <v-input
              type="password"
              label="Create your password"
              v-model="v$.payloads.password.$model"
              :errors="v$.payloads.password.$errors"
              :isValidData="!v$.payloads.password.$invalid">
          </v-input>
          <v-input
              type="password"
              label="Confirm your password"
              v-model="v$.payloads.passwordConfirm.$model"
              :errors="v$.payloads.passwordConfirm.$errors"
              :isValidData="!v$.payloads.passwordConfirm.$invalid">
          </v-input>
          <div class="d-flex justify-content-start">
            <button type="submit" class="btn btn-primary" :disabled="v$.$invalid || status.loading">
              <span v-show="!status.loading">Submit</span>
              <span v-show="status.loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </span>
            </button>
            <router-link :to="{ name: 'Login' }" class="btn btn-outline-primary ms-3">Cancel</router-link>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { helpers, required, sameAs } from "@vuelidate/validators";
import { mapActions, mapState } from "vuex";
import VInput from "@/components/custom-fields/v-input";

export default {
  name: "ResetPassword",
  components: {
    VInput
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      tokenStatus: false,
      payloads: {
        token: null,
        password: '',
        passwordConfirm: ''
      }
    }
  },
  async mounted() {
    const { token } = this.$route.query
    this.payloads.token = token
    await this.$router.replace(location.pathname)
    await this.validate(token)
  },
  validations() {
    return {
      payloads: {
        password: {
          required: helpers.withMessage('This field cannot be empty', required),
        },
        passwordConfirm: {
          required: helpers.withMessage('This field cannot be empty', required),
          sameAs: helpers.withMessage('The entered passwords do not match', sameAs(this.payloads.password))
        }
      }
    };
  },
  computed: {
    ...mapState('account', ['status', 'response'])
  },
  methods: {
    ...mapActions({
      validateResetToken: 'account/validateResetToken',
      resetPassword: 'account/resetPassword',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async validate(token) {
      if (token) {
        await this.validateResetToken(token).then(async () => {
          if (this.status.success) {
            this.tokenStatus = true
            await this.success(this.response)
          } else {
            this.tokenStatus = false
            await this.error(this.response)
          }
        })
      }
    },
    async onSubmit() {
      const validated = await this.v$.$validate()
      if (validated) {
        await this.resetPassword(this.payloads).then(async () => {
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
}
</script>

<style scoped>

</style>
