<template>
  <v-card v-if="profile" flat>
    <v-card-title>
      <span class="text-h5">My Profile</span>
    </v-card-title>
    <v-container fluid>
      <v-row class="d-flex justify-start align-center flex-column flex-sm-row">
        <v-col cols="12" sm="3" lg="2" class="d-flex justify-center">
          <v-avatar size="150">
            <v-img v-if="avatar" :src="avatarPath" :lazy-src="avatarPath"
                   :alt="profile.firstName + ' ' + profile.lastName"
                   :title="profile.firstName + ' ' + profile.lastName"
            />
            <v-icon color="success" size="100" v-else>mdi-account-circle</v-icon>
          </v-avatar>
        </v-col>
        <v-col xl="3" lg="4" md="5" sm="9" xs="2">
          <v-file-input
              :rules="rules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Pick an avatar"
              label="Avatar"
              color="success"
              prepend-icon="mdi-camera-account"
              show-size
              @change="selectImage"
              ref="avatar"
          />
          <v-btn color="success" class="mt-2" block :loading="loadingUpload" :disabled="loadingUpload" @click="upload">
            <span>Upload</span>
            <v-icon class="ml-1">mdi-cloud-upload</v-icon>
          </v-btn>
          <div v-if="progress" class="mt-2">
            <v-progress-linear v-model="progress" color="success" height="20" reactive>
              <strong>{{ progress }} %</strong>
            </v-progress-linear>
          </div>
        </v-col>
        <v-col v-if="previewImage" cols="12" xl="7" lg="6">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="text-subtitle-2">Preview Image</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-img :src="previewImage" :lazy-src="previewImage" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-form @submit.native="onDialog">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="profile.firstName"
                prepend-icon="mdi-account-outline"
                label="First Name"
                color="success"
                :loading="loadingFirstName"
                readonly>
              <template v-slot:append>
                <v-btn color="success" class="mb-2" @click="onDialog" text>Update First Name</v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="profile.lastName"
                prepend-icon="mdi-account-outline"
                label="Last Name"
                color="success"
                :loading="loadingLastName"
                readonly>
              <template v-slot:append>
                <v-btn color="success" class="mb-2" @click="onDialog" text>Update Last Name</v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <v-card :loading="loadingUpdate" flat>
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
                        color="success"
                        label="First Name"
                        prepend-icon="mdi-account-outline"
                        placeholder="Enter your First Name"
                        @blur="$v.fullName.firstName.$touch()"
                        @input="$v.fullName.firstName.$touch()"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                        ref="lastName"
                        v-model="fullName.lastName"
                        :error-messages="lastNameErrors"
                        color="success"
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
              <v-btn color="success" @click="dialog = false" text large>Close</v-btn>
              <v-spacer />
              <v-btn color="success" type="submit" :disabled="($v.$invalid && $v.$error) || loadingUpdate" :loading="loadingUpdate" large text>
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { alpha, minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { firstNameErrors, lastNameErrors } from "@/utils/validations";
import { accountService } from "@/services";

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
      lastName: ''
    },
    types: [''],
    rules: [
      value => !!value || 'Please choose the image file',
      value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      value => {
        const types = ['image/png', 'image/jpeg']
        const message = 'Avatar can only have the following types of extensions: .png, .jpg, .jpeg'
        return !value || types.includes(value.type) || message
      }
    ],
    avatar: false,
    avatarPath: process.env.VUE_APP_ACCOUNT_AVATAR_ROUTE,
    currentImage: null,
    previewImage: null,
    progress: 0,
    profile: null,
    dialog: false,
    loadingUpdate: false,
    loadingUpload: false,
    loadingFirstName: false,
    loadingLastName: false
  }),
  created() {
    this.profile = this.user
    console.log("profile: " + this.profile.id)
    this.getById(this.profile.id).then(response => {
      response.data?.avatar?.id && response.data?.avatar?.filename ? this.avatar = true : null
    }).catch(error => {
      console.log(error.response)
    })
    this.avatarPath += `/${this.profile.id}`
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
      getById: 'account/getById',
      update: 'account/update',
      setSnackbar: 'notification/setSnackbar'
    }),
    selectImage(image) {
      this.currentImage = image
      if (image) {
        this.previewImage = URL.createObjectURL(this.currentImage)
      } else {
        this.previewImage = null
        this.$refs.avatar.resetValidation()
      }
    },
    upload() {
      if (!this.currentImage) {
        return this.setSnackbar({ color: 'error', text: 'Firstly, please select the image file' })
      }
      this.loadingUpload = true
      this.progress = 0
      accountService.uploadAvatar(this.currentImage, this.profile.id, event => {
        this.progress = Math.round((100 * event.loaded) / event.total)
      }).then(response => {
        console.log(response)
        this.avatar = true
        this.avatarPath = `${process.env.VUE_APP_ACCOUNT_AVATAR_ROUTE}/${this.profile.id}/${response.data.avatar.filename}`
        this.setSnackbar({ color: 'success', text: response.data.message })
        this.previewImage = undefined
        this.$refs.avatar.reset()
      }).catch((error) => {
        this.avatar = false
        this.currentImage = undefined
        this.setSnackbar({ color: 'error', text: error.res })
      }).finally(() => {
        this.loadingUpload = false
        setTimeout(() => this.progress = 0, 1000)
      })
    },
    onDialog(event) {
      const value = event.path[3].children[0].children[1].value || event.path[2].children[0].children[1].value
      value === this.profile.lastName ? setTimeout(() => this.$refs.lastName.focus(), 0) : null
      value === this.profile.lastName ? this.loadingLastName = true : this.loadingFirstName = true
      this.dialog = true
      this.fullName.firstName = this.profile.firstName
      this.fullName.lastName = this.profile.lastName
    },
    async submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loadingUpdate = true
        this.profile.firstName = this.fullName.firstName
        this.profile.lastName = this.fullName.lastName
        await this.update(this.profile).then(response => {
          console.log(response)
          this.profile = response.data
          this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loadingUpdate = this.dialog = false)
      }
    }
  },
  watch: {
    dialog(value) {
      !value ? this.loadingFirstName = this.loadingLastName = false : null
    }
  }
}
</script>
