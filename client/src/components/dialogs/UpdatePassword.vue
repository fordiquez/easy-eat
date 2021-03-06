<template>
  <v-dialog v-model="isDialog" @input="onCloseDialog" max-width="500">
    <v-card :loading="loading">
      <v-card-title>
        <span class="text-h5">Update password</span>
      </v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="updatedAccount.password"
                    :error-messages="passwordErrors"
                    :type="passwordVisibility ? 'text' : 'password'"
                    :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-outline"
                    label="Current password"
                    placeholder="Enter your current password"
                    autocomplete="currentPassword"
                    ref="password"
                    @click:append="passwordVisibility = !passwordVisibility"
                    @blur="$v.updatedAccount.password.$touch()"
                    @input="$v.updatedAccount.password.$touch()"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="updatedAccount.updatedPassword"
                    :error-messages="updatedPasswordErrors"
                    :type="updatedPasswordVisibility ? 'text' : 'password'"
                    :append-icon="updatedPasswordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-outline"
                    label="Create a new password"
                    placeholder="Enter a new password"
                    autocomplete="createdPassword"
                    @click:append="updatedPasswordVisibility = !updatedPasswordVisibility"
                    @blur="$v.updatedAccount.updatedPassword.$touch()"
                    @input="$v.updatedAccount.updatedPassword.$touch()"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="updatedAccount.updatedPasswordConfirm"
                    :error-messages="updatedPasswordConfirmErrors"
                    :type="updatedPasswordConfirmVisibility ? 'text' : 'password'"
                    :append-icon="updatedPasswordConfirmVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-outline"
                    label="Confirm a new password"
                    placeholder="Confirm your new password"
                    autocomplete="createdPasswordConfirm"
                    @click:append="updatedPasswordConfirmVisibility = !updatedPasswordConfirmVisibility"
                    @blur="$v.updatedAccount.updatedPasswordConfirm.$touch()"
                    @input="$v.updatedAccount.updatedPasswordConfirm.$touch()"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="success" @click="onCloseDialog">Cancel</v-btn>
          <v-spacer />
          <v-btn text color="success" type="submit" :disabled="($v.$invalid && $v.$error) || loading" :loading="loading">Update</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
import { hasNumerics, validationRules } from "@/utils/validations";

export default {
  name: "UpdatePasswordDialog",
  mixins: [ validationMixin ],
  props: {
    updatePasswordDialog: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    updatedAccount: {
      id: '',
      password: '',
      updatedPassword: '',
      updatedPasswordConfirm: '',
    },
    loading: false,
    isDialog: false,
    passwordVisibility: false,
    updatedPasswordVisibility: false,
    updatedPasswordConfirmVisibility: false,
  }),
  created() {
    this.updatedAccount.id = this.accountId
    this.isDialog = this.updatePasswordDialog
    this.isDialog ? setTimeout(() => this.$refs.password.focus(), 0) : null
  },
  validations: {
    updatedAccount: {
      password: {
        required
      },
      updatedPassword: {
        required,
        minLength: minLength(6),
        hasNumerics
      },
      updatedPasswordConfirm: {
        required,
        sameAs: sameAs('updatedPassword'),
        minLength: minLength(6),
        hasNumerics
      }
    },
  },
  computed: {
    passwordErrors() {
      return validationRules(this.$v.updatedAccount.password, 'Password', {})
    },
    updatedPasswordErrors() {
      return validationRules(this.$v.updatedAccount.updatedPassword, 'Updated password', { minLength: 6, sameAs: 'Passwords must be identical' })
    },
    updatedPasswordConfirmErrors() {
      return validationRules(this.$v.updatedAccount.updatedPasswordConfirm, 'Confirmation updated password', { minLength: 6, sameAs: 'Passwords must be identical' })
    }
  },
  methods: {
    ...mapActions({
      update: 'account/update',
      setSnackbar: 'notification/setSnackbar'
    }),
    onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.update(this.updatedAccount).then(response => {
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
      this.$emit('close-dialog', false)
    }
  },
}
</script>

