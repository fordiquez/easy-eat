<template>
  <v-card v-if="profile" flat>
    <v-card-title>
      <span class="text-h5">My Profile</span>
    </v-card-title>
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="profile.firstName"
                prepend-icon="mdi-account-outline"
                label="First Name"
                :loading="dialog"
                @click="onDialog"
                readonly
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="profile.lastName"
                prepend-icon="mdi-account-outline"
                label="Last Name"
                :loading="dialog"
                @click="onDialog"
                readonly
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card :loading="loading" flat>
            <v-card-title>
              <span class="text-h5">Update full name</span>
            </v-card-title>
            <v-form @submit.prevent="submit">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                          v-model="fullName.firstName"
                          :error-messages="firstNameErrors"
                          label="First Name"
                          prepend-icon="mdi-account-outline"
                          placeholder="Enter your First Name"
                          @blur="$v.fullName.firstName.$touch()"
                          @input="$v.fullName.firstName.$touch()"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                          v-model="fullName.lastName"
                          :error-messages="lastNameErrors"
                          label="Last Name"
                          prepend-icon="mdi-account-outline"
                          placeholder="Enter your Last Name"
                          @blur="$v.fullName.lastName.$touch()"
                          @input="$v.fullName.lastName.$touch()"
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
import { alpha, minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import {firstNameErrors, lastNameErrors} from "@/utils/validations";

export default {
  name: "ProfileSettings",
  mixins: [ validationMixin ],
  props: {
    user: {
      type: [Object, Boolean],
      default: null
    }
  },
  data: () => ({
    fullName: {
      firstName: '',
      lastName: '',
      activeFocus: ''
    },
    profile: null,
    dialog: false,
    loading: false
  }),
  mounted() {
    this.profile = this.user
    console.log("profile: " + this.profile.id)
  },
  validations: {
    fullName: {
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
    }
  },
  computed: {
    firstNameErrors() {
      return firstNameErrors(this.$v.fullName.firstName)
    },
    lastNameErrors() {
      return lastNameErrors(this.$v.fullName.lastName)
    },
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
        this.profile = response.data
      }).catch(error => {
        console.log(error.response)
      })
    },
    onDialog() {
      this.dialog = true
      this.fullName.firstName = this.profile.firstName
      this.fullName.lastName = this.profile.lastName
    },
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.profile.firstName = this.fullName.firstName
        this.profile.lastName = this.fullName.lastName
        await this.update(this.profile).then(response => {
          console.log(response)
          this.profile = response.data
          this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = this.dialog = false)
      }
    }
  }
}
</script>
