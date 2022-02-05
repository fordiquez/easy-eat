<template>
  <v-card :loading="status.loading" flat>
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
              <v-btn class="mr-4" :loading="status.loading" :disabled="status.loading" color="success" type="submit">Reset</v-btn>
              <v-btn class="mr-4" color="primary" :to="{ name: 'Login' }">Cancel</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import {mapActions, mapState} from "vuex";
import { required, email } from "vuelidate/lib/validators";
import {validationMixin} from "vuelidate";

export default {
  name: "ForgotPassword",
  mixins: [ validationMixin ],
  data: () => ({
    email: ''
  }),
  validations: {
    email: {
      required,
      email
    },
  },
  computed: {
    ...mapState('alert', ['status']),
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) {
        return errors
      }
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
  },
  methods: {
    ...mapActions({
      forgotPassword: 'account/forgotPassword',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.forgotPassword(this.email).then(response => {
          console.log(response)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
