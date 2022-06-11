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
        </v-row>
        <v-card-actions>
          <v-btn color="success" class="mr-4" :loading="loading" :disabled="loading || $v.form.$anyError" type="submit">
            <v-icon class="mr-1">mdi-login</v-icon>
            <span>Log In</span>
          </v-btn>
          <v-btn text color="success" :to="{ name: 'Register' }">
            <v-icon class="mr-1">mdi-account-plus</v-icon>
            <span>Sign Up</span>
          </v-btn>
          <v-spacer />
          <v-btn text color="red" :to="{ name: 'ForgotPassword' }">
            <v-icon class="mr-1">mdi-lock-reset</v-icon>
            <span>Forgot Password</span>
          </v-btn>
        </v-card-actions>
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
