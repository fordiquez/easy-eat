<template>
  <v-dialog v-model="dialog" max-width="700" :fullscreen="$vuetify.breakpoint.xsOnly" @input="onCloseDialog">
    <v-card :loading="loading">
      <v-toolbar color="success" dense>
        <v-toolbar-title>Creating new user account</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="ml-5" @click="onCloseDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
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
                <v-icon class="mr-3">mdi-account-multiple</v-icon>
                <label class="text-subtitle-1" :class="$vuetify.breakpoint.smAndUp ? 'mr-3' : ''">Role</label>
                <v-btn-toggle v-model="user.role" :class="$vuetify.breakpoint.xsOnly ? 'd-flex justify-center' : ''" mandatory shaped>
                  <v-btn value="User" text :style="$vuetify.breakpoint.xsOnly ? { width: '50%' } : ''" :color="user.role === 'User' ? 'success' : ''"
                  >
                    <v-icon :color="user.role === 'User' ? 'success' : ''">mdi-account</v-icon>
                    <v-card-text class="text-subtitle-1 text-capitalize">User</v-card-text>
                  </v-btn>
                  <v-btn value="Admin" text :style="$vuetify.breakpoint.xsOnly ? { width: '50%' } : ''" :color="user.role === 'Admin' ? 'success' : ''"
                  >
                    <v-icon :color="user.role === 'Admin' ? 'success' : ''">mdi-account-lock</v-icon>
                    <v-card-text class="text-subtitle-1 text-capitalize">Admin</v-card-text>
                  </v-btn>
                </v-btn-toggle>
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
import { hasNumerics, validationRules } from "@/utils/validations";
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
      return validationRules(this.$v.user.firstName, 'First Name', {})
    },
    lastNameErrors() {
      return validationRules(this.$v.user.lastName, 'Last Name', {})
    },
    emailErrors() {
      return validationRules(this.$v.user.email, 'Email', {})
    },
    passwordErrors() {
      return validationRules(this.$v.user.password, 'Password', { minLength: 6, sameAs: 'Passwords must be identical' })
    },
    passwordConfirmErrors() {
      return validationRules(this.$v.user.passwordConfirm, 'Confirmation password', { minLength: 6, sameAs: 'Passwords must be identical' })
    },
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
