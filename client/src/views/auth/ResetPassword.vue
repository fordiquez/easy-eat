<template>
  <v-card :loading="loading" rounded>
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
        </v-row>
        <v-card-actions>
          <v-btn color="success" type="submit" :loading="loading" :disabled="loading">
            <v-icon class="mr-1">mdi-lock-reset</v-icon>
            <span>Reset Password</span>
          </v-btn>
          <v-spacer />
          <v-btn text color="success" :to="{ name: 'Login' }">Cancel</v-btn>
        </v-card-actions>
      </v-container>
    </v-form>
    <template v-else>
      <v-card-subtitle class="text-subtitle-2 pb-0">Token validation failed</v-card-subtitle>
      <v-card-text class="text-button text--primary">
        <span>If the token has expired you can get a new one at the</span>
        <v-btn color="success" :to="{ name: 'ForgotPassword' }" plain text>forgot password</v-btn>
        <span>page</span>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" :to="{ name: 'Login' }" text>
          <v-icon class="mr-1">mdi-login</v-icon>
          <span>Log In</span>
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import { hasNumerics, validationRules } from "@/utils/validations";

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
  created() {
    const { token } = this.$route.query
    this.form.token = token
    this.validate(token)
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
      return validationRules(this.$v.form.password, 'Password', { minLength: 6, sameAs: 'Passwords must be identical' })
    },
    passwordConfirmErrors() {
      return validationRules(this.$v.form.passwordConfirm, 'Confirmation password', { minLength: 6, sameAs: 'Passwords must be identical' })
    }
  },
  methods: {
    ...mapActions('account', ['validateResetToken', 'resetPassword']),
    ...mapActions('notification', ['setAlert', 'setSnackbar']),
    validate(token) {
      if (token) {
        this.loading = true
        this.$router.replace(location.pathname)
        this.validateResetToken(token).then(response => {
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
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.resetPassword(this.form).then(response => {
          console.log(response)
           this.$router.push({ name: 'Login' }).then(() => {
             this.setAlert({ type: 'success', text: response.data.message })
             this.setSnackbar({ color: 'success', text: response.data.message })
           })
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
