<template>
  <v-dialog v-model="dialog" max-width="700" :fullscreen="$vuetify.breakpoint.xsOnly" @input="onCloseDialog">
    <v-card :loading="loading">
      <v-card-title>
        <span class="text-h5">Creating a new user account</span>
      </v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="user.firstName"
                    :error-messages="firstNameErrors"
                    label="First name"
                    prepend-icon="mdi-account-outline"
                    placeholder="Enter your first name"
                    ref="firstName"
                    @blur="$v.user.firstName.$touch()"
                    @input="$v.user.firstName.$touch()"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="user.lastName"
                    :error-messages="lastNameErrors"
                    label="Last Name"
                    prepend-icon="mdi-account-outline"
                    placeholder="Enter your last name"
                    @blur="$v.user.lastName.$touch()"
                    @input="$v.user.lastName.$touch()"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="user.email"
                    :error-messages="emailErrors"
                    label="Email address"
                    prepend-icon="mdi-email-outline"
                    placeholder="Enter your email address"
                    @blur="$v.user.email.$touch()"
                    @input="$v.user.email.$touch()"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="user.password"
                    :error-messages="passwordErrors"
                    :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordVisibility ? 'text' : 'password'"
                    label="Password"
                    autocomplete="password"
                    prepend-icon="mdi-lock-outline"
                    placeholder="Create your password"
                    @click:append="passwordVisibility = !passwordVisibility"
                    @blur="$v.user.password.$touch()"
                    @input="$v.user.password.$touch()"
                    counter
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="user.passwordConfirm"
                    :error-messages="passwordConfirmErrors"
                    :append-icon="passwordConfirmVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordConfirmVisibility ? 'text' : 'password'"
                    label="Confirm password"
                    autocomplete="confirmPassword"
                    prepend-icon="mdi-lock-outline"
                    placeholder="Confirm your password"
                    @click:append="passwordConfirmVisibility = !passwordConfirmVisibility"
                    @blur="$v.user.passwordConfirm.$touch()"
                    @input="$v.user.passwordConfirm.$touch()"
                    counter
                />
              </v-col>
              <v-col cols="12">
                <v-radio-group v-model="user.role" :error-messages="roleErrors" prepend-icon="mdi-account-multiple" dense row>
                  <span class="mr-2">User role</span>
                  <v-radio label="User" value="User" @change="$v.user.role.$touch()"></v-radio>
                  <v-radio label="Admin" value="Admin" @change="$v.user.role.$touch()"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="success" @click="onCloseDialog">Cancel</v-btn>
          <v-spacer />
          <v-btn text color="success" type="submit" :disabled="$v.$anyError || loading" :loading="loading">
            <v-icon color="success" class="mr-1">mdi-account-check</v-icon>
            <span>Save</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  emailErrors,
  firstNameErrors, hasNumerics,
  lastNameErrors,
  passwordConfirmErrors,
  passwordErrors,
  roleErrors
} from "@/utils/validations";
import { alpha, email, minLength, required, sameAs } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "CreateUserDialog",
  mixins: [ validationMixin ],
  props: {
    isCreating: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    user: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      password: '',
      passwordConfirm: ''
    },
    dialog: false,
    loading: false,
    passwordVisibility: false,
    passwordConfirmVisibility: false,
  }),
  created() {
    this.dialog = this.isCreating
    if (this.isCreating) setTimeout(() => this.$refs.firstName.focus(), 0)
  },
  validations: {
    user: {
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
      role: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('account', ['getUsers']),
    firstNameErrors() {
      return firstNameErrors(this.$v.user.firstName)
    },
    lastNameErrors() {
      return lastNameErrors(this.$v.user.lastName)
    },
    emailErrors() {
      return emailErrors(this.$v.user.email)
    },
    passwordErrors() {
      return passwordErrors(this.$v.user.password)
    },
    passwordConfirmErrors() {
      return passwordConfirmErrors(this.$v.user.passwordConfirm)
    },
    roleErrors() {
      return roleErrors(this.$v.user.role)
    }
  },
  methods: {
    ...mapActions('account', ['getAll', 'create']),
    ...mapActions('notification', ['setSnackbar']),
    onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.create(this.user).then(response => {
          console.log(response)
          this.setSnackbar({ color: 'success', text: response.data.message })
          this.onCloseDialog()
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    },
    onCloseDialog() {
      this.$emit('close-dialog')
    }
  },
}
</script>
