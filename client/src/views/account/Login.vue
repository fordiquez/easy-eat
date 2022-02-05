<template>
  <v-card :loading="status.loading" flat>
    <v-card-title>Log In</v-card-title>
    <v-card-subtitle class="pb-0">Please enter your account information for authorization</v-card-subtitle>
    <v-form ref="form" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-text-field
                v-model="form.email"
                :error-messages="emailErrors"
                label="E-mail address"
                prepend-icon="mdi-email-outline"
                placeholder="Enter your e-mail address"
                @blur="$v.form.email.$touch()"
                @input="$v.form.email.$touch()" />
          </v-col>

          <v-col cols="12">
            <v-text-field
                v-model="form.password"
                :error-messages="passwordErrors"
                :type="visibility ? 'text' : 'password'"
                :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                prepend-icon="mdi-lock-outline"
                label="Password"
                placeholder="Enter your password"
                autocomplete="password"
                @click:append="visibility = !visibility"
                @blur="$v.form.password.$touch()"
                @input="$v.form.password.$touch()" />
          </v-col>

          <v-col cols="12">
            <v-btn class="mr-4" color="success" :loading="status.loading" :disabled="status.loading" type="submit">Log In</v-btn>
            <v-btn class="mr-4" color="primary" :to="{ name: 'Register' }">Sign Up</v-btn>
            <v-btn class="mr-4" color="error" :to="{ name: 'ForgotPassword' }">Forgot Password</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  mixins: [ validationMixin ],
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    visibility: false
  }),
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  computed: {
    ...mapState('alert', ['status']),
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) {
        return errors
      }
      !this.$v.form.email.email && errors.push('Must be valid e-mail')
      !this.$v.form.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) {
        return errors
      }
      !this.$v.form.password.required && errors.push('Password is required')
      return errors
    },
  },
  methods: {
    ...mapActions('account', ['login']),
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.login(this.form).then(async response => {
          console.log(response)
          response.status === 200 && this.status.success ? await this.$router.push({ name: 'Home' }) : null
        })
      }
    },
    reset () {
      this.$v.$reset()
      this.form.email = this.form.password = null
    }
  }
}
</script>
