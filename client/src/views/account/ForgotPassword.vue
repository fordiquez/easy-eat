<template>
  <div class="card">
    <h3 class="card-header">Forgot Password</h3>
    <div class="card-body">
      <form @submit.prevent="onSubmit">
        <v-input
            type="email"
            label="Email"
            v-model="v$.email.$model"
            :errors="v$.email.$errors"
            :isValidData="!v$.email.$invalid">
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
    </div>
  </div>
</template>

<script>
import VInput from "@/components/custom-fields/v-input";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { mapActions, mapState } from "vuex";

export default {
  name: "ForgotPassword",
  components: {
    VInput
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      email: ''
    }
  },
  validations() {
    return {
      email: {
        required: helpers.withMessage('This field cannot be empty', required),
        email: helpers.withMessage('This field has an invalid email address', email)
      },
    };
  },
  computed: {
    ...mapState('account', ['status', 'response'])
  },
  methods: {
    ...mapActions({
      forgotPassword: 'account/forgotPassword',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async onSubmit() {
      const validated = await this.v$.$validate()
      if (validated) {
        await this.forgotPassword(this.email).then(async () => {
          this.status.success ? this.success(this.response) : this.error(this.response)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
