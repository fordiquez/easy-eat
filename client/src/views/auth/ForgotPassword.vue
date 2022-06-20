<template>
  <v-card :loading="loading" rounded>
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
        </v-row>
        <v-card-actions>
          <v-btn color="success" :loading="loading" :disabled="loading || $v.email.$anyError" type="submit">
            <v-icon class="mr-1">mdi-lock-reset</v-icon>
            <span>Reset Password</span>
          </v-btn>
          <v-spacer />
          <v-btn text color="success" :to="{ name: 'Login' }">Cancel</v-btn>
        </v-card-actions>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { validationRules } from "@/utils/validations";

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
      return validationRules(this.$v.email, 'Email', {})
    },
  },
  methods: {
    ...mapActions({
      forgotPassword: 'account/forgotPassword',
      setAlert: 'notification/setAlert',
      setSnackbar: 'notification/setSnackbar'
    }),
    submit() {
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
