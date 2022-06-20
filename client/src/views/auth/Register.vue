<template>
  <v-card :loading="loading" rounded>
    <v-card-title>Sign Up</v-card-title>
    <v-card-subtitle class="pb-0">Please fill in all required fields to register an account</v-card-subtitle>
    <v-form @submit.prevent="submit">
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
                @input="$v.form.email.$touch()"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="form.password"
                :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordErrors"
                :type="passwordVisibility ? 'text' : 'password'"
                label="Password"
                autocomplete="password"
                prepend-icon="mdi-lock-outline"
                placeholder="Create your password"
                counter
                @click:append="passwordVisibility = !passwordVisibility"
                @blur="$v.form.password.$touch()"
                @input="$v.form.password.$touch()"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="form.passwordConfirm"
                :append-icon="passwordConfirmVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordConfirmErrors"
                :type="passwordConfirmVisibility ? 'text' : 'password'"
                label="Password Confirmation"
                autocomplete="password-confirm"
                prepend-icon="mdi-lock-outline"
                placeholder="Confirm your password"
                counter
                @click:append="passwordConfirmVisibility = !passwordConfirmVisibility"
                @blur="$v.form.passwordConfirm.$touch()"
                @input="$v.form.passwordConfirm.$touch()"
            />
          </v-col>
          <v-col cols="12" md="6" lg="5" xl="3">
            <v-checkbox
                v-model="acceptedTerms"
                :error-messages="acceptedTermsErrors"
                on-icon="mdi-marker-check"
                off-icon="mdi-alert-circle-check-outline"
                @change="$v.acceptedTerms.$touch()"
            >
              <template v-slot:label>
                <v-flex @click.stop>
                  <span>Agree and accept the </span>
                  <a class="custom-link" @click.prevent="terms = true">terms</a>
                  <span> & </span>
                  <a class="custom-link" @click.prevent="conditions = true">conditions</a>
                </v-flex>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-btn text color="success" :to="{ name: 'Login' }">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn type="submit" color="success" :disabled="($v.$invalid && $v.$error) || loading" :loading="loading">
          <v-icon class="mr-1">mdi-account-plus</v-icon>
          <span>Sign Up</span>
        </v-btn>
      </v-card-actions>
    </v-form>
    <v-dialog v-model="terms" :fullscreen="$vuetify.breakpoint.xsOnly">
      <v-card>
        <v-card-title class="text-h6">Terms</v-card-title>
        <v-card-text v-for="n in 5" :key="n">{{ content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text block large color="success" @click="terms = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="conditions" :fullscreen="$vuetify.breakpoint.xsOnly">
      <v-card>
        <v-card-title class="text-h6">Conditions</v-card-title>
        <v-card-text v-for="n in 5" :key="n">{{ content }}</v-card-text>
        <v-card-actions>
          <v-btn text block large color="success" @click="conditions = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { required, alpha, minLength, email, sameAs } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapActions } from "vuex";
import { hasNumerics, validationRules } from "@/utils/validations";

export default {
  name: 'Register',
  mixins: [ validationMixin ],
  data: () => ({
    form: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: ''
    },
    loading: false,
    passwordVisibility: false,
    passwordConfirmVisibility: false,
    terms: false,
    conditions: false,
    acceptedTerms: false,
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
        minLength: minLength(6),
        hasNumerics
      },
    },
    acceptedTerms: {
      sameAs: sameAs(() => true)
    }
  },
  computed: {
    firstNameErrors() {
      return validationRules(this.$v.form.firstName, 'First Name', {})
    },
    lastNameErrors() {
      return validationRules(this.$v.form.lastName, 'Last Name', {})
    },
    emailErrors() {
      return validationRules(this.$v.form.email, 'Email', {})
    },
    passwordErrors() {
      return validationRules(this.$v.form.password, 'Password', { minLength: 6, sameAs: 'Passwords must be identical' })
    },
    passwordConfirmErrors() {
      return validationRules(this.$v.form.passwordConfirm, 'Confirmation password', { minLength: 6, sameAs: 'Passwords must be identical' })
    },
    acceptedTermsErrors() {
      return validationRules(this.$v.acceptedTerms, null, { sameAs: 'You don\'t have a choice, you eat it' })
    }
  },
  methods: {
    ...mapActions('account', ['register']),
    ...mapActions('notification', ['setSnackbar', 'setAlert']),
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.register(this.form).then(response => {
          console.log(response)
          this.$router.push({ name: 'Login' }).then(() => {
            this.setAlert({ type: 'success', text: response.data.messages.success })
            this.setAlert({ type: 'info', text: response.data.messages.info })
            this.setSnackbar({ color: 'info', text: response.data.messages.info })
            this.setSnackbar({ color: 'success', text: response.data.messages.success })
          })
        }).catch(error => {
          console.log(error.response)
          this.setAlert({ type: 'error', text: error.response.data.message })
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    },
  },
}
</script>