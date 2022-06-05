<template>
  <v-card v-if="profile">
    <v-container fluid>
      <v-row>
        <v-col class="d-flex align-center justify-space-between">
          <v-card-title class="text-h5 py-0">My Profile</v-card-title>
          <v-subheader v-if="status" class="text-subtitle-1 grey--text">
            <v-progress-circular indeterminate size="25" color="success" />
            <label class="ml-2" v-text="status" />
          </v-subheader>
        </v-col>
      </v-row>
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
        <v-col xl="3" lg="4" md="5" sm="9">
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
          <v-btn v-if="previewImageUrl" outlined block color="success" @click="previewImage = true">
            <v-icon class="mr-1">mdi-image-search</v-icon>
            <span>Preview</span>
          </v-btn>
          <v-btn color="success" class="mt-2" block :loading="loadingUpload" :disabled="loadingUpload" @click="upload">
            <v-icon class="mr-1">mdi-cloud-upload</v-icon>
            <span>Upload</span>
          </v-btn>
          <div v-if="progress" class="mt-2">
            <v-progress-linear v-model="progress" color="success" height="20" reactive>
              <strong>{{ progress }} %</strong>
            </v-progress-linear>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="5" xl="4">
          <v-text-field v-model="profile.firstName" label="First Name" color="success" :loading="loadingFirstName" readonly>
            <template v-slot:append>
              <v-btn color="success" class="mb-2" @click="onDialog('firstName')" text>
                Update {{ $vuetify.breakpoint.smAndDown ? '' : 'First Name' }}
              </v-btn>
            </template>
            <template v-slot:prepend>
              <v-icon color="success" class="mt-1">mdi-account-outline</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="5" xl="4">
          <v-text-field v-model="profile.lastName" label="Last Name" color="success" :loading="loadingLastName" readonly>
            <template v-slot:append>
              <v-btn color="success" class="mb-2" @click="onDialog('lastName')" text>
                Update {{ $vuetify.breakpoint.smAndDown ? '' : 'Last Name' }}
              </v-btn>
            </template>
            <template v-slot:prepend>
              <v-icon color="success" class="mt-1">mdi-account-outline</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn-toggle v-model="userData.sex" :class="$vuetify.breakpoint.xsOnly ? 'd-flex' : ''" @change="updateUserData('sex')" :mandatory="userData.sex !== null" shaped>
            <v-btn
                value="male" x-large text
                :style="$vuetify.breakpoint.xsOnly ? { width: '50%' } : ''" :color="userData.sex === 'male' ? 'success' : ''"
            >
              <v-icon :color="userData.sex === 'male' ? 'success' : ''">mdi-gender-male</v-icon>
              <v-card-text class="text-subtitle-1 text-capitalize">Male</v-card-text>
            </v-btn>
            <v-btn
                value="female" x-large text
                :style="$vuetify.breakpoint.xsOnly ? { width: '50%' } : ''" :color="userData.sex === 'female' ? 'success' : ''"
            >
              <v-icon :color="userData.sex === 'female' ? 'success' : ''">mdi-gender-female</v-icon>
              <v-card-text class="text-subtitle-1 text-capitalize">Female</v-card-text>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 5" md="3" lg="2">
          <div>
            <v-menu ref="dateMenu" v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="birthdayDate" label="Birthday date" color="success" :error-messages="birthdayDateErrors" v-bind="attrs" v-on="on" readonly>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-calendar</v-icon>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker v-model="birthdayDate" color="success" :active-picker.sync="activePicker" :max="maxDate" scrollable @change="updateBirthdayDate" />
            </v-menu>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" md="3">
          <v-text-field
              v-model.number="userData.currentWeight"
              :error-messages="weightErrors"
              class="input-number"
              suffix="kg"
              type="number"
              color="success"
              label="Current weight"
              placeholder="Enter weight"
              @blur="$v.userData.currentWeight.$touch()"
              @input="$v.userData.currentWeight.$touch()"
              @change="updateUserData('currentWeight')"
              hide-spin-buttons
          >
            <template v-slot:prepend>
              <v-btn icon color="success"
                     :disabled="userData.currentWeight <= 0"
                     :style="{ cursor: userData.currentWeight === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                     @click="decrement('currentWeight')">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
            <template v-slot:append-outer>
              <v-btn icon color="success" @click="increment('currentWeight')">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" md="3">
          <v-text-field
              v-model.number="userData.height"
              :error-messages="heightErrors"
              class="input-number"
              suffix="cm"
              type="number"
              color="success"
              label="Height"
              placeholder="Enter height"
              append-outer-icon="mdi-plus"
              @blur="$v.userData.height.$touch()"
              @input="$v.userData.height.$touch()"
              @change="updateUserData('height')"
              hide-spin-buttons
          >
            <template v-slot:prepend>
              <v-btn icon color="success"
                     :disabled="userData.height <= 0"
                     :style="{ cursor: userData.height === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                     @click="decrement('height')"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
            <template v-slot:append-outer>
              <v-btn icon color="success" @click="increment('height')">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-select
              v-model="userData.activityLevel"
              :items="getActivities.labels"
              color="success"
              item-color="success"
              label="Activity level"
              @change="updateUserData('activityLevel')"
          />
          <v-card-text class="pt-0 grey--text text-center">{{ getActivities.descriptions[activityIndex] }}</v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card :loading="loadingUpdate" flat>
        <v-card-title>
          <span class="text-h5">Update Full Name</span>
        </v-card-title>
        <v-form @submit.prevent="updateFullName">
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
                      @focus="loadingFirstName = true"
                      @blur="onBlur('firstName')"
                      @input="$v.fullName.firstName.$touch()"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="fullName.lastName"
                      :error-messages="lastNameErrors"
                      color="success"
                      ref="lastName"
                      label="Last Name"
                      prepend-icon="mdi-account-outline"
                      placeholder="Enter your Last Name"
                      @focus="loadingLastName = true"
                      @blur="onBlur('lastName')"
                      @input="$v.fullName.lastName.$touch()"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="dialog = false" text large>Cancel</v-btn>
            <v-spacer />
            <v-btn color="success" type="submit" :disabled="($v.$invalid && $v.$error) || loadingUpdate" :loading="loadingUpdate" large text>
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="previewImage" scrollable>
      <v-card>
        <v-card-title class="text-h5">Preview Image</v-card-title>
        <v-card-text>
          <v-img :src="previewImageUrl" :lazy-src="previewImageUrl" alt="Preview image" title="Preview image" />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" outlined block @click="previewImage = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { alpha, minLength, required, minValue, maxValue } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { birthdayDateErrors, firstNameErrors, hasNumerics, lastNameErrors, numericErrors, rangeDate } from "@/utils/validations";
import { accountService } from "@/services";
import moment from "moment";

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
    avatarPath: `${process.env.VUE_APP_BASE_API_URL}${process.env.VUE_APP_ACCOUNT_AVATAR_PATH}`,
    currentImage: null,
    previewImage: false,
    previewImageUrl: null,
    progress: 0,
    profile: null,
    dialog: false,
    status: null,
    loadingUpdate: false,
    loadingUpload: false,
    loadingFirstName: false,
    loadingLastName: false,
    userData: {},
    dateMenu: false,
    activePicker: null,
    birthdayDate: null,
  }),
  created() {
    this.status = 'Loading...'
    this.profile = this.user
    if (this.profile.avatar?.id && this.profile.avatar?.filename) this.avatar = true
    this.getUserDataById(this.profile.id).then(() => {
      this.getUserData.subscribe(userData => this.userData = userData)
      if (this.userData?.birthdayDate) this.birthdayDate = moment(this.userData.birthdayDate).format('YYYY-MM-DD')
    }).catch(error => {
      if (error.response.data.message === 'User data not found') {
        this.status = 'Loading...'
        this.userData.accountId = this.user.id
        this.create(this.userData).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.status = null)
      } else {
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }
    }).finally(() => this.status = null)
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
    },
    userData: {
      birthdayDate: {
        rangeDate
      },
      currentWeight: {
        hasNumerics,
        minValue: minValue(25),
        maxValue: maxValue(300)
      },
      height: {
        hasNumerics,
        minValue: minValue(90),
        maxValue: maxValue(250)
      },
    }
  },
  computed: {
    ...mapGetters('userData', ['getUserData', 'getActivities']),
    firstNameErrors() {
      return firstNameErrors(this.$v.fullName.firstName)
    },
    lastNameErrors() {
      return lastNameErrors(this.$v.fullName.lastName)
    },
    maxDate() {
      return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10)
    },
    birthdayDateErrors() {
      return birthdayDateErrors(this.$v.userData.birthdayDate, [new Date('1922-02-22').toISOString().slice(0, 10), this.maxDate])
    },
    weightErrors() {
      return numericErrors(this.$v.userData.currentWeight, 'currentWeight', [25, 300])
    },
    heightErrors() {
      return numericErrors(this.$v.userData.height, 'height', [90, 250])
    },
    activityIndex() {
      return this.getActivities.labels.findIndex(activity => activity === this.userData.activityLevel)
    },
  },
  methods: {
    ...mapActions({
      getUserDataById: 'userData/getById',
      userDataUpdate: 'userData/update',
      create: 'userData/create',
      accountUpdate: 'account/update',
      setSnackbar: 'notification/setSnackbar'
    }),
    selectImage(image) {
      this.currentImage = image
      image ? this.previewImageUrl = URL.createObjectURL(this.currentImage) : this.previewImageUrl = null
      if (!image) this.$refs.avatar.resetValidation()
    },
    upload() {
      if (!this.currentImage) return this.setSnackbar({ color: 'error', text: 'Firstly, please select the image file' })
      this.loadingUpload = true
      this.progress = 0
      accountService.uploadAvatar(this.currentImage, this.profile.id, event => {
        this.progress = Math.round((100 * event.loaded) / event.total)
      }).then(response => {
        console.log(response)
        this.avatar = true
        this.avatarPath = `${process.env.VUE_APP_BASE_API_URL}${process.env.VUE_APP_ACCOUNT_AVATAR_PATH}/${this.profile.id}/${response.data.avatar.filename}`
        this.setSnackbar({ color: 'success', text: response.data.message })
        this.previewImageUrl = null
        this.$refs.avatar.reset()
      }).catch((error) => {
        this.avatar = false
        this.currentImage = undefined
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => {
        this.loadingUpload = false
        setTimeout(() => this.progress = 0, 1000)
      })
    },
    onDialog(textField) {
      if (textField === 'lastName') setTimeout(() => this.$refs.lastName.focus(), 0)
      this.dialog = true
      this.fullName.firstName = this.profile.firstName
      this.fullName.lastName = this.profile.lastName
    },
    onBlur(textField) {
      textField === 'firstName' ? this.loadingFirstName = false : this.loadingLastName = false
      textField === 'firstName' ? this.$v.fullName.firstName.$touch() : this.$v.fullName.lastName.$touch()
    },
    updateFullName() {
      this.$v.fullName.$touch()
      if (!this.$v.fullName.$invalid) {
        this.loadingUpdate = true
        this.profile.firstName = this.fullName.firstName
        this.profile.lastName = this.fullName.lastName
        this.accountUpdate(this.profile).then(response => {
          console.log(response)
          this.profile = response.data
          this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loadingUpdate = this.dialog = false)
      }
    },
    updateBirthdayDate(date) {
      this.$refs.dateMenu.save(date)
      this.birthdayDate = moment(date).format('YYYY-MM-DD')
      this.userData.birthdayDate = this.birthdayDate
      this.updateUserData('birthdayDate')
    },
    increment(property) {
      if (!this.userData[property]) this.userData[property] = 1
      else this.userData[property] += 1
      this.updateUserData(property)
    },
    decrement(property) {
      if (!this.userData[property]) this.userData[property] = 1
      else this.userData[property] -= 1
      this.updateUserData(property)
    },
    updateUserData(property) {
      console.log(property)
      this.$v.userData[property]?.$touch()
      if (!this.status && !this.$v.userData[property]?.$invalid) {
        this.status = 'Saving...'
        const payload = {}
        payload.accountId = this.userData.accountId
        payload[property] = this.userData[property]
        console.log(payload)
        if (this.userData.selectedPlan) this.userData.selectedPlan = this.userData.selectedPlan.id
        this.userDataUpdate(payload).then(response => {
          console.log(response)
          this.setSnackbar({ color: 'success', position: 'right', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.status = null)
      }
    },
  },
  watch: {
    dateMenu(value) {
      value && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
}
</script>
