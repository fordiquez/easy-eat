<template>
  <v-card :loading="loading" flat>
    <v-card-title>Account recovery</v-card-title>
    <v-card-subtitle class="pb-0">Please enter the email from your account</v-card-subtitle>
    <v-form ref="form" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                prepend-icon="mdi-email-outline"
                label="E-mail address"
                placeholder="Enter your e-mail address"
                @blur="$v.email.$touch()"
                @input="$v.email.$touch()" />
          </v-col>

          <v-col cols="12">
            <v-card-actions>
              <v-btn class="mr-4" :loading="loading" :disabled="loading" color="success" type="submit">Reset</v-btn>
              <v-btn class="mr-4" color="primary" :to="{ name: 'Login' }">Cancel</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { emailErrors } from "@/utils/validations";

export default {
  name: "ForgotPassword",
  mixins: [ validationMixin ],
  data: () => ({
    email: '',
    loading: false
  }),
  validations: {
    email: {
      required,
      email
    },
  },
  computed: {
    emailErrors() {
      return emailErrors(this.$v.email)
    },
  },
  methods: {
    ...mapActions({
      forgotPassword: 'account/forgotPassword',
      setAlert: 'notifications/setAlert',
      setSnackbar: 'notifications/setSnackbar'
    }),
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.forgotPassword(this.email).then(response => {
          console.log(response)
          this.setAlert({ type: 'success', text: response.data.message })
          this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setAlert({ type: 'error', text: error.response.data.message })
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    }
  }
}
</script>

<style scoped>

</style>
