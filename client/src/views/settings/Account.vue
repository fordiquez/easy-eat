<template>
  <v-card v-if="account" flat>
    <v-card-title>
      <span class="text-h5">Account Settings</span>
    </v-card-title>
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="account.email"
                prepend-icon="mdi-email-outline"
                label="E-mail address"
                :loading="dialog"
                readonly
                disabled
            >
              <v-btn slot="append" color="success" class="mb-2" @click="onDialog" text>Update E-mail</v-btn>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card :loading="loading" flat>
            <v-card-title>
              <span class="text-h5">Update e-mail address</span>
            </v-card-title>
            <v-form @submit.prevent="submit">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                          v-model="email"
                          :error-messages="emailErrors"
                          label="New e-mail address"
                          prepend-icon="mdi-email-outline"
                          placeholder="Enter a new email address"
                          @blur="$v.email.$touch()"
                          @input="$v.email.$touch()"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                          v-model="password"
                          :error-messages="passwordErrors"
                          :type="visibility ? 'text' : 'password'"
                          :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
                          prepend-icon="mdi-lock-outline"
                          label="Current password"
                          placeholder="Confirm your password"
                          autocomplete="password"
                          @click:append="visibility = !visibility"
                          @blur="$v.password.$touch()"
                          @input="$v.password.$touch()"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" @click="dialog = false" text large>Close</v-btn>
                <v-spacer />
                <v-btn color="blue darken-1" type="submit" :disabled="($v.$invalid && $v.$error) || loading" :loading="loading" large text>
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import {emailErrors, passwordErrors} from "@/utils/validations";

export default {
  name: "AccountSettings",
  mixins: [ validationMixin ],
  props: {
    user: {
      type: [Object, Boolean],
      default: null
    }
  },
  data: () => ({
    email: '',
    password: '',
    account: null,
    dialog: false,
    loading: false,
    visibility: false
  }),
  mounted() {
    this.account = this.user
    console.log("account: " + this.account.id)
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  computed: {
    emailErrors() {
      return emailErrors(this.$v.email)
    },
    passwordErrors() {
      return passwordErrors(this.$v.password)
    }
  },
  methods: {
    ...mapActions({
      update: 'account/update',
      setSnackbar: 'notification/setSnackbar'
    }),
    async updateUser() {
      console.log(this.user)
      await this.update(this.user).then(response => {
        console.log(response)
        this.account = response.data
      }).catch(error => {
        console.log(error.response)
      })
    },
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.account.email = this.email
        this.account.password = this.password
        console.log(this.account)
        await this.update(this.account).then(response => {
          console.log(response)
          this.account = response.data
          this.setSnackbar({ color: 'success', text: response.data.message })
          this.dialog = false
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    },
    onDialog() {
      this.dialog = true
      this.email = this.password = ''
      this.$v.$reset()
    }
  }
}
</script>
