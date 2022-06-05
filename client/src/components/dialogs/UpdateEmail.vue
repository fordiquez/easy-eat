<template>
  <v-dialog v-model="isDialog" @input="onCloseDialog" max-width="500px">
    <v-card :loading="loading" flat>
      <v-card-title>
        <span class="text-h5">Update e-mail address</span>
      </v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="updatedAccount.email"
                    :error-messages="emailErrors"
                    label="New e-mail address"
                    prepend-icon="mdi-email-outline"
                    placeholder="Enter a new email address"
                    ref="email"
                    @blur="$v.updatedAccount.email.$touch()"
                    @input="$v.updatedAccount.email.$touch()"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                    v-model="updatedAccount.password"
                    :error-messages="passwordErrors"
                    :type="visibility ? 'text' : 'password'"
                    :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock-outline"
                    label="Current password"
                    placeholder="Confirm your password"
                    autocomplete="passwordConfirm"
                    @click:append="visibility = !visibility"
                    @blur="$v.updatedAccount.password.$touch()"
                    @input="$v.updatedAccount.password.$touch()"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" @click="onCloseDialog" text large>Cancel</v-btn>
          <v-spacer />
          <v-btn
              color="blue darken-1"
              type="submit"
              :disabled="($v.$invalid && $v.$error) || loading"
              :loading="loading"
              large text
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { email, required } from "vuelidate/lib/validators";
import { emailErrors, passwordErrors } from "@/utils/validations";
import { validationMixin } from "vuelidate";
import { mapActions } from "vuex";

export default {
  name: "UpdateEmailDialog",
  mixins: [ validationMixin ],
  props: {
    updateEmailDialog: {
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
      email: '',
      password: '',
    },
    loading: false,
    isDialog: false,
    visibility: false
  }),
  created() {
    this.updatedAccount.id = this.accountId
    this.isDialog = this.updateEmailDialog
    if (this.isDialog) setTimeout(() => this.$refs.email.focus(), 0)
  },
  validations: {
    updatedAccount: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    },
  },
  computed: {
    emailErrors() {
      return emailErrors(this.$v.updatedAccount.email)
    },
    passwordErrors() {
      return passwordErrors(this.$v.updatedAccount.password)
    },
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
          this.$emit('updated-email', response.data.email)
          this.onCloseDialog()
          this.setSnackbar({ color: 'success', text: response.data.message })
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

