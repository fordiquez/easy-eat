<template>
  <v-card :loading="loading" flat>
    <v-card-title>Reset password</v-card-title>
    <v-form v-if="tokenStatus" ref="form" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="form.password"
                :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordErrors"
                :type="visibility ? 'text' : 'password'"
                label="Password"
                autocomplete="password"
                prepend-icon="mdi-lock-outline"
                placeholder="Create your password"
                counter
                @click:append="visibility = !visibility"
                @blur="$v.form.password.$touch()"
                @input="$v.form.password.$touch()"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="form.passwordConfirm"
                :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordConfirmErrors"
                :type="visibility ? 'text' : 'password'"
                label="Password Confirmation"
                autocomplete="password-confirm"
                prepend-icon="mdi-lock-outline"
                placeholder="Confirm your password"
                counter
                @click:append="visibility = !visibility"
                @blur="$v.form.passwordConfirm.$touch()"
                @input="$v.form.passwordConfirm.$touch()"
            />
          </v-col>

          <v-col cols="12">
            <v-card-actions>
              <v-btn class="mr-4" color="success" type="submit" :loading="loading" :disabled="loading">
                Reset
              </v-btn>
              <v-btn class="mr-4" color="primary" :to="{ name: 'Login' }">Cancel</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <template v-else>
      <v-card-subtitle class="text-subtitle-2 pb-0">Token validation failed</v-card-subtitle>
      <v-card-text class="text-button text--primary">
        <span>If the token has expired you can get a new one at the</span>
        <v-btn color="primary" :to="{ name: 'ForgotPassword' }" plain text>forgot password</v-btn>
        <span>page</span>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import { passwordConfirmErrors, passwordErrors, hasNumerics } from "@/utils/validations";

export default {
  name: "ResetPassword",
  mixins: [ validationMixin ],
  data: () => ({
    tokenStatus: false,
    visibility: false,
    loading: false,
    form: {
      token: null,
      password: '',
      passwordConfirm: ''
    }
  }),
  async mounted() {
    const { token } = this.$route.query
    this.form.token = token
    await this.validate(token)
  },
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(6),
        hasNumerics
      },
      passwordConfirm: {
        required,
        sameAs: sameAs('password'),
        minLength: minLength(6),
        hasNumerics
      },
    }
  },
  computed: {
    passwordErrors() {
      return passwordErrors(this.$v.form.password)
    },
    passwordConfirmErrors() {
      return passwordConfirmErrors(this.$v.form.passwordConfirm)
    }
  },
  methods: {
    ...mapActions({
      validateResetToken: 'account/validateResetToken',
      resetPassword: 'account/resetPassword',
      setAlert: 'notifications/setAlert',
      setSnackbar: 'notifications/setSnackbar'
    }),
    async validate(token) {
      if (token) {
        this.loading = true
        await this.$router.replace(location.pathname)
        await this.validateResetToken(token).then(response => {
          console.log(response)
          this.tokenStatus = true
          this.setAlert({ type: 'success', text: response.data.message })
          this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.tokenStatus = false
          this.setAlert({ type: 'error', text: error.response.data.message })
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      } else {
        this.setAlert({ type: 'error', text: 'Reset token not provided' })
        this.setSnackbar({ color: 'error', text: 'Reset token not provided' })
      }
    },
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        await this.resetPassword(this.form).then(async response => {
          console.log(response)
          await this.$router.push({ name: 'Login' })
          await this.setAlert({ type: 'success', text: response.data.message })
          await this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setAlert({ type: 'error', text: error.response.data.message })
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = true)
      }
    }
  }
}
</script>

<style scoped>

</style>
