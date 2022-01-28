<template>
  <form class="card" @submit.prevent="onSubmit">
    <div class="card-body">
      <v-input
          type="text"
          label="First Name"
          v-model="v$.formData.firstName.$model"
          :errors="v$.formData.firstName.$errors"
          :isValidData="!v$.formData.firstName.$invalid">
      </v-input>
      <v-input
          type="text"
          label='Last Name'
          v-model="v$.formData.lastName.$model"
          :errors="v$.formData.lastName.$errors"
          :isValidData="!v$.formData.lastName.$invalid">
      </v-input>
      <v-input
          type="email"
          label="Email"
          v-model="v$.formData.email.$model"
          :errors="v$.formData.email.$errors"
          :isValidData="!v$.formData.email.$invalid">
      </v-input>
      <v-input
          type="password"
          label="Create your password"
          v-model="v$.formData.password.$model"
          :errors="v$.formData.password.$errors"
          :isValidData="!v$.formData.password.$invalid">
      </v-input>
      <v-input
          type="password"
          label="Confirm your password"
          v-model="v$.formData.passwordConfirm.$model"
          :errors="v$.formData.passwordConfirm.$errors"
          :isValidData="!v$.formData.passwordConfirm.$invalid">
      </v-input>
      <v-checkbox
          label="Agree to terms and conditions"
          v-model="v$.formData.acceptTerms.$model"
          :errors="v$.formData.acceptTerms.$errors"
          :isValidData="!v$.formData.acceptTerms.$invalid"
          :is-array="false">
      </v-checkbox>
      <div class="d-flex justify-content-start">
        <button type="submit" class="btn btn-primary" :disabled="v$.$invalid || status.loading">
          <span v-if="!status.loading">Sign Up</span>
          <span v-else>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </span>
        </button>
        <router-link :to="{ name: 'Login' }" class="btn btn-outline-primary ms-3">Sign In</router-link>
      </div>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, helpers } from "@vuelidate/validators";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import VInput from "@/components/custom-fields/v-input"
import VRadio from "@/components/custom-fields/v-radio"
import VCheckbox from "@/components/custom-fields/v-checkbox";

export default defineComponent({
  name: "RegisterForm",
  components: {
    VCheckbox,
    VInput,
    VRadio
  },
  setup() {
    return { v$: useVuelidate() };
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
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: "",
        passwordConfirm: "",
        acceptTerms: false,
      },
    };
  },
  validations() {
    return {
      formData: {
        firstName: {
          required: helpers.withMessage('This field cannot be empty', required)
        },
        lastName: {
          required: helpers.withMessage('This field cannot be empty', required)
        },
        email: {
          required: helpers.withMessage('This field cannot be empty', required),
          email: helpers.withMessage('This field has an invalid email address', email)
        },
        password: {
          required: helpers.withMessage('This field cannot be empty', required)
        },
        passwordConfirm: {
          required: helpers.withMessage('This field cannot be empty', required),
          sameAs: helpers.withMessage('The entered passwords do not match', sameAs(this.formData.password))
        },
        acceptTerms: {
          sameAs: helpers.withMessage('You must agree before submitting', sameAs(true))
        }
      },
    };
  },
  computed: {
    ...mapState('account', ['status', 'response'])
  },
  methods: {
    ...mapActions({
      register: 'account/register',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async onSubmit() {
      const validated = await this.v$.$validate()
      if (validated) {
        console.table(this.formData)
        await this.register(this.formData).then(async () => {
          if (this.status.success) {
            await this.$router.push({ name: 'Login' })
            await this.success(this.response)
          } else {
            await this.error(this.response)
          }
        })
      }
    },
  },
});
</script>
