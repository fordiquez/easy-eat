<template>
  <form class="card" @submit.prevent="onSubmit">
    <div class="card-body">
      <v-input
          type="email"
          label="Email"
          v-model="v$.formData.email.$model"
          :errors="v$.formData.email.$errors"
          :isValidData="!v$.formData.email.$invalid">
      </v-input>
      <v-input
          type="password"
          label="Password"
          v-model="v$.formData.password.$model"
          :errors="v$.formData.password.$errors"
          :isValidData="!v$.formData.password.$invalid">
      </v-input>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <button type="submit" class="btn btn-primary" :disabled="v$.$invalid || status.loading">
            <span v-show="!status.loading">Sign In</span>
            <span v-show="status.loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </span>
          </button>
          <router-link :to="{ name: 'Register' }" class="btn btn-outline-primary ms-3">Sign Up</router-link>
        </div>
        <router-link :to="{ name: 'ForgotPassword' }" class="link-secondary text-decoration-none">Forgot Password?</router-link>
      </div>
    </div>
  </form>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import VInput from "@/components/custom-fields/v-input";

export default defineComponent({
  name: "LoginForm",
  components: {
    VInput,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
    };
  },
  validations() {
    return {
      formData: {
        email: {
          required: helpers.withMessage('This field cannot be empty', required),
          email: helpers.withMessage('This field has an invalid email address', email)
        },
        password: {
          required: helpers.withMessage('This field cannot be empty', required)
        },
      },
    };
  },
  watch: {
    formData: {
      handler(value) {
        this.$emit("formData", value);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState('account', ['status', 'response'])
  },
  methods: {
    ...mapActions({
      login: 'account/login',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async onSubmit() {
      const validated = await this.v$.$validate()
      if (validated) {
        console.table(this.formData);
        await this.login(this.formData).then(async () => {
          if (this.status.success) {
            await this.$router.push({ name: 'Home' })
          } else {
            await this.error(this.response)
          }
        })
      }
    },
  },
});
</script>
