<template>
  <v-card :loading="status.loading" flat>
    <v-card-title>Sign Up</v-card-title>
    <v-card-subtitle class="pb-0">Please fill in all required fields to register an account</v-card-subtitle>
    <v-form ref="form" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="form.firstName"
                :error-messages="firstNameErrors"
                label="First name"
                prepend-icon="mdi-account-outline"
                placeholder="Enter your first name"
                @blur="$v.form.firstName.$touch()"
                @input="$v.form.firstName.$touch()"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="form.lastName"
                :error-messages="lastNameErrors"
                label="Last name"
                prepend-icon="mdi-account-outline"
                placeholder="Enter your last name"
                @blur="$v.form.lastName.$touch()"
                @input="$v.form.lastName.$touch()"
            />
          </v-col>
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
            <v-checkbox
                v-model="form.acceptedTerms"
                :error-messages="termsErrors"
                on-icon="mdi-marker-check"
                off-icon="mdi-alert-circle-check-outline"
                color="success"
                @change="$v.form.acceptedTerms.$touch()"
            >
              <template v-slot:label>
                <div @click.stop="">
                  <span>Agree and accept the </span>
                  <a class="custom-link" @click.prevent="terms = true">terms</a>
                  <span> & </span>
                  <a class="custom-link" @click.prevent="conditions = true">conditions</a>
                </div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-btn :to="{ name: 'Login' }" text>Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn :disabled="$v.$invalid && $v.$error" :loading="status.loading" color="primary" type="submit" text>
          Sign Up
        </v-btn>
      </v-card-actions>
    </v-form>
    <v-dialog v-model="terms" width="80%">
      <v-card>
        <v-card-title class="text-h6">Terms</v-card-title>
        <v-card-text v-for="n in 5" :key="n">{{ content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="success" @click="terms = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="conditions" width="80%">
      <v-card>
        <v-card-title class="text-h6">
          Conditions
        </v-card-title>
        <v-card-text v-for="n in 5" :key="n">
          {{ content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="success" @click="conditions = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { required, alpha, minLength, email, sameAs } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { hasNumerics } from "@/utils/validators";
import {mapActions, mapState} from "vuex";

export default {
  name: 'Register',
  mixins: [ validationMixin ],
  data: () => ({
    form: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      acceptedTerms: false,
    },
    visibility: false,
    terms: false,
    conditions: false,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.',
  }),
  validations: {
    form: {
      firstName: {
        required,
        alpha,
        minLength: minLength(2)
      },
      lastName: {
        required,
        alpha,
        minLength: minLength(2)
      },
      email: {
        required,
        email
      },
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
      acceptedTerms: {
        sameAs: sameAs(() => true)
      }
    }
  },
  computed: {
    ...mapState('alert', ['status']),
    firstNameErrors() {
      const errors = []
      if (!this.$v.form.firstName.$dirty) {
        return errors
      }
      !this.$v.form.firstName.required && errors.push('First Name is required')
      !this.$v.form.firstName.alpha && errors.push('First Name must contain only alphabetic characters')
      !this.$v.form.firstName.minLength && errors.push('First Name must have at least 2 symbols')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.form.lastName.$dirty) {
        return errors
      }
      !this.$v.form.lastName.required && errors.push('Last Name is required')
      !this.$v.form.lastName.alpha && errors.push('Last Name must contain only alphabetic characters')
      !this.$v.form.lastName.minLength && errors.push('Last Name must have at least 2 symbols')
      return errors
    },
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
      !this.$v.form.password.hasNumerics && errors.push('Password must contain at least 1 digit')
      return errors
    },
    termsErrors() {
      const errors = []
      if (!this.$v.form.acceptedTerms.$dirty) {
        return errors
      }
      !this.$v.form.acceptedTerms.sameAs && errors.push('You don\'t have a choice, you eat it')
      return errors
    }
  },
  methods: {
    ...mapActions({
      register: 'account/register',
      error: 'alert/error',
      success: 'alert/success',
      info: 'alert/info'
    }),
    resetForm() {
      this.form = Object.assign({})
      this.$v.$reset()
    },
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.register(this.form).then(async response => {
          console.log(response)
          if (response.status === 200) {
            await this.$router.push({ name: 'Login' })
            await this.success({ status: true, message: response.data.messages.success })
            await this.info({ status: true, message: response.data.messages.info })
          } else {
            await this.error({ status: true, message: response.data.message })
          }
        }).catch(async error => {
          console.log(error.response)
          await this.error({status: true, message: error.response.data.message})
        })
      }
    },
  },
}
</script>

<style>
.custom-link:hover {
  text-decoration: underline;
}
</style>
