<template>
  <v-card :loading="status.loading" flat>
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
              <v-btn class="mr-4" color="success" type="submit" :loading="status.loading" :disabled="status.loading">
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
import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import { hasNumerics } from "@/utils/validators";

export default {
  name: "ResetPassword",
  mixins: [ validationMixin ],
  data: () => ({
    tokenStatus: false,
    visibility: false,
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
        hasNumerics
      },
    }
  },
  computed: {
    ...mapState('alert', ['status']),
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) {
        return errors
      }
      !this.$v.form.password.required && errors.push('Password is required')
      !this.$v.form.password.minLength && errors.push('Password must have at least 6 symbols')
      !this.$v.form.password.hasNumerics && errors.push('Password must contain at least 1 digit')
      return errors
    },
    passwordConfirmErrors() {
      const errors = []
      if (!this.$v.form.passwordConfirm.$dirty) {
        return errors
      }
      !this.$v.form.passwordConfirm.required && errors.push('You must confirm your password')
      !this.$v.form.passwordConfirm.sameAs && errors.push('Passwords must be identical')
      !this.$v.form.passwordConfirm.hasNumerics && errors.push('Password must contain at least 1 digit')
      return errors
    },
  },
  methods: {
    ...mapActions({
      validateResetToken: 'account/validateResetToken',
      resetPassword: 'account/resetPassword',
      success: 'alert/success',
      error: 'alert/error'
    }),
    async validate(token) {
      if (token) {
        await this.$router.replace(location.pathname)
        await this.validateResetToken(token).then(response => {
          console.log(response)
          response.status === 200 ? this.tokenStatus = true : false
        }).catch(error => {
          console.log(error.response)
          this.tokenStatus = false
        })
      } else {
        this.error({status: true, message: 'Reset token not provided' })
      }
    },
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.resetPassword(this.form).then(async response => {
          console.log(response)
          if (response.status === 200) {
            await this.$router.push({ name: 'Login' })
            await this.success({ status: true, message: response.data.message })
          } else {
            await this.error({ status: true, message: response.data.message })
          }
        }).catch(error => {
          console.log(error.response)
          this.error({ status: true, message: error.response.data.message })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
