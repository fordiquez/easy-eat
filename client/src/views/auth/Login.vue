<template>
  <v-card :loading="loading" rounded>
    <v-card-title>Log In</v-card-title>
    <v-card-subtitle class="pb-0">Please enter your account information for authorization</v-card-subtitle>
    <v-form @submit.prevent="submit">
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
            <v-btn class="mr-4" color="success" :loading="loading" :disabled="loading" type="submit">Log In</v-btn>
            <v-btn class="mr-4" color="primary" :to="{ name: 'Register' }">Sign Up</v-btn>
            <v-btn class="mr-4" color="error" :to="{ name: 'ForgotPassword' }">Forgot Password</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import { emailErrors, passwordErrors } from "@/utils/validations";

export default {
  name: 'Login',
  mixins: [ validationMixin ],
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    visibility: false,
    loading: false,
    returnUrl: undefined
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
    emailErrors() {
      return emailErrors(this.$v.form.email)
    },
    passwordErrors() {
      return passwordErrors(this.$v.form.password)
    },

  },
  methods: {
    ...mapActions('account', ['login']),
    ...mapActions('notification', ['setAlert', 'setSnackbar']),
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.login(this.form).then(response => {
          console.log(response)
          this.$router.push(this.returnUrl ? { path: this.returnUrl } : { name: 'DailyLog' }).then(() => {
            this.setAlert({ type: 'success', text: response.data.message })
            this.setSnackbar({ color: 'success', text: response.data.message })
          })
        }).catch(error => {
          console.log(error.response)
          this.setAlert({ type: 'error', text: error.response.data.message })
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    }
  },
  watch: {
    $route($route) {
      this.returnUrl = $route.query.returnUrl
    }
  }
}
</script>
