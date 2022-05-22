<template>
  <v-card class="mx-auto">
    <v-stepper v-model="step">
      <v-stepper-header>
        <template v-for="n in steps">
          <v-stepper-step color="success" :class="n === 1 ? 'pl-1' : n === steps ? 'pr-1' : 'px-5'" :key="`${n}-step`" :complete="step > n" :step="n">
            {{ content[n - 1].step }}
          </v-stepper-step>
          <v-divider v-if="n !== steps" :key="n" />
        </template>
      </v-stepper-header>
    </v-stepper>
    <v-row class="d-flex justify-center align-center flex-column my-5">
      <v-card-title class="text-h6 font-weight-regular">{{ currentTitle }}</v-card-title>
      <v-card-subtitle class="text-caption grey--text">{{ currentSubtitle }}</v-card-subtitle>
    </v-row>

    <v-window v-model="step">
      <v-window-item :value="1">
        <v-row class="d-flex justify-center">
          <v-col cols="10" sm="5" md="4">
            <v-text-field
                v-model.number="userData.currentWeight"
                :error-messages="currentWeightErrors"
                class="input-number"
                type="number"
                color="success"
                label="Current weight"
                placeholder="Enter weight"
                append-outer-icon="mdi-plus"
                @click:append-outer="increment('currentWeight')"
                @blur="$v.userData.currentWeight.$touch()"
                @input="$v.userData.currentWeight.$touch()"
                @keyup.enter="nextStep"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon
                    :disabled="currentWeight <= 0"
                    :style="{ cursor: currentWeight === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                    @click="decrement('currentWeight')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="2">
        <v-row class="d-flex justify-center">
          <v-col cols="10" sm="5" md="4">
            <v-text-field
                v-model.number="userData.goalWeight"
                :error-messages="goalWeightErrors"
                class="input-number"
                type="number"
                color="success"
                label="Goal weight"
                placeholder="Enter weight"
                append-outer-icon="mdi-plus"
                @click:append-outer="increment('goalWeight')"
                @blur="$v.userData.goalWeight.$touch()"
                @input="$v.userData.goalWeight.$touch()"
                @keyup.enter="nextStep"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon
                       :disabled="goalWeight <= 0"
                       :style="{ cursor: goalWeight === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement('goalWeight')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="3">
        <v-row class="d-flex justify-center">
          <v-col cols="10" sm="5" md="4">
            <v-text-field
                v-model.number="userData.height"
                :error-messages="heightErrors"
                class="input-number"
                type="number"
                color="success"
                label="Height"
                placeholder="Enter height"
                append-outer-icon="mdi-plus"
                @click:append-outer="increment('height')"
                @blur="$v.userData.height.$touch()"
                @input="$v.userData.height.$touch()"
                @keyup.enter="nextStep"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon
                       :disabled="height <= 0"
                       :style="{ cursor: height === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement('height')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="4">
        <v-row class="d-flex justify-center">
          <v-col>
            <v-chip-group v-model="userData.sex" class="chip-group" column>
              <v-chip
                  value="male" filter-icon="mdi-gender-male" text-color="success"
                  :color="sex === 'male' ? 'success' : ''" @keyup.enter="nextStep" filter large outlined
              >
                Male
              </v-chip>
              <v-chip
                  value="female" filter-icon="mdi-gender-female" text-color="success"
                  :color="sex === 'female' ? 'success' : ''" @keyup.enter="nextStep" filter large outlined>
                Female
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="5">
        <v-row class="d-flex justify-center">
          <v-col cols="10" sm="5" md="4" lg="3">
            <div>
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="userData.birthdayDate"
                      label="Birthday date" prepend-icon="mdi-calendar" color="success"
                      :error-messages="birthdayDateErrors" v-bind="attrs" v-on="on" readonly />
                </template>
                <v-date-picker v-model="userData.birthdayDate" color="success" :active-picker.sync="activePicker" :max="maxDate" scrollable @change="save" />
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item :value="6">
        <v-row class="d-flex justify-center flex-column align-center">
          <v-col cols="12" md="8" xl="6" class="d-flex justify-center">
            <v-img max-width="200" :src="activityImage" :lazy-src="activityImage" :alt="activities.titles[activityIndex]" :title="activities.titles[activityIndex]" />
          </v-col>
          <v-col cols="12" md="8" xl="6">
            <v-slider v-model="activityIndex" track-fill-color="success" thumb-color="success" :max="4" :tick-labels="activityLabels" hide-details />
          </v-col>
          <v-col cols="12" md="8" xl="6" class="d-flex flex-column justify-center align-center">
            <v-card-title>{{ activityTitle }}</v-card-title>
            <v-card-text class="text-center">{{ activityDescription }}</v-card-text>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :disabled="step === 1" text @click="step--" width="100">Back</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success" width="100" @click="nextStep" v-if="step !== steps">Continue</v-btn>
      <v-btn color="success" width="200" @click="addUserData" :loading="loading" v-else>Create meal plan</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, between } from "vuelidate/lib/validators";
import { birthdayDateErrors, hasNumerics, numericErrors, sexErrors, rangeDate } from "@/utils/validations";
import { mapActions } from "vuex";

export default {
  name: 'Onboarding',
  mixins: [ validationMixin ],
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    step: 1,
    steps: 6,
    content: [
      {
        step: 'Current weight',
        model: 'currentWeight',
        title: 'What\'s your latest weight?',
        subtitle: 'You can update your weight at any time'
      },
      {
        step: 'Goal weight',
        model: 'goalWeight',
        title: 'What\'s your goal weight?',
        subtitle: 'You can update your goal weight at any time'
      },
      {
        step: 'Height',
        model: 'height',
        title: 'How tall are you?',
        subtitle: 'Your height helps us create your personalized plan'
      },
      {
        step: 'Sex',
        model: 'sex',
        title: 'What\'s your sex?',
        subtitle: 'This helps us create your personalized plan'
      },
      {
        step: 'Birthday date',
        model: 'birthdayDate',
        title: 'When\'s your birthday?',
        subtitle: 'Your birthday helps us create your personalized plan'
      },
      {
        step: 'Activity',
        model: 'activityLevel',
        title: 'How active are you?',
        subtitle: 'Don\'t worry, you can easily change your profile later'
      }
    ],
    userData: {
      accountId: null,
      currentWeight: 0,
      goalWeight: 0,
      height: 0,
      sex: '',
      birthdayDate: null,
      activityLevel: 'Sedentary',
    },
    menu: false,
    activePicker: null,
    activityIndex: 0,
    activities: {
      labels: ['Sedentary', 'Light', 'Moderate', 'Very', 'Extra'],
      titles: ['Sedentary', 'Lightly Active', 'Moderate Active', 'Very Active', 'Extra Active'],
      descriptions: [
        'Desk job with little or no exercise.',
        'Work a job with light physical demands, or work a desk job and perform light exercise (at the level of a brisk walk) for 30 minutes per day, 3-5 times per week.',
        'Work a moderately physically demanding job, such as construction worker, or work a desk job and engage in moderate exercise for 1 hour per day, 3-5 times per week.',
        'Work a consistently physically demanding job, such as agricultural worker, or work a desk job and engage in intense exercise for 1 hour per day, or moderate exercise for 2 hours per day, 5-7 times per week.',
        'Work an extremely physically demanding job, such as professional athlete, competitive cyclist, or fitness professional, or engage in intense exercise for at least 2 hours per day.'
      ]
    },
    loading: false
  }),
  created() {
    this.userData.accountId = this.user.id
  },
  validations: {
    userData: {
      currentWeight: {
        required,
        hasNumerics,
        between: between(1, 1000)
      },
      goalWeight: {
        required,
        hasNumerics,
        between: between(1, 1000)
      },
      height: {
        required,
        hasNumerics,
        between: between(90, 240)
      },
      sex: {
        required
      },
      birthdayDate: {
        required,
        rangeDate
      },
      activityLevel: {
        required
      }
    }
  },
  computed: {
    currentTitle() {
      return this.content[this.step - 1].title
    },
    currentSubtitle() {
      return this.content[this.step - 1].subtitle
    },
    currentWeight() {
      return this.userData.currentWeight
    },
    goalWeight() {
      return this.userData.goalWeight
    },
    height() {
      return this.userData.height
    },
    sex() {
      return this.userData.sex
    },
    maxDate() {
      return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10)
    },
    activityImage() {
      return `/img/activities/${this.userData.sex}-${this.activities.labels[this.activityIndex].toLowerCase()}.svg`
    },
    activityLabels() {
      return this.$vuetify.breakpoint.smAndUp ? this.activities.labels : []
    },
    activityTitle() {
      return this.activities.titles[this.activityIndex]
    },
    activityDescription() {
      return this.activities.descriptions[this.activityIndex]
    },
    currentWeightErrors() {
      return numericErrors(this.$v.userData.currentWeight, this.content[this.step - 1].step, [1, 1000])
    },
    goalWeightErrors() {
      return numericErrors(this.$v.userData.goalWeight, this.content[this.step - 1].step, [1, 1000])
    },
    heightErrors() {
      return numericErrors(this.$v.userData.height, this.content[this.step - 1].step, [90, 240])
    },
    birthdayDateErrors() {
      return birthdayDateErrors(this.$v.userData.birthdayDate, [new Date('1922-02-22').toISOString().slice(0, 10), this.maxDate])
    },
    sexErrors() {
      return sexErrors(this.$v.userData.sex)
    },
  },
  methods: {
    ...mapActions({
      setSnackbar: 'notification/setSnackbar',
      create: 'userData/create'
    }),
    increment(property) {
      this.userData[property] = parseInt(this.userData[property],10) + 1
      this.$v.userData[property].$touch()
    },
    decrement(property) {
      this.userData[property] = parseInt(this.userData[property],10) - 1
      this.$v.userData[property].$touch()
    },
    save(date) {
      this.$refs.menu.save(date)
    },
    nextStep() {
      const model = this.content[this.step - 1].model
      const errors = model + 'Errors'
      this.$v.userData[model].$touch()
      if (this.$v.userData[model].$invalid) {
        this[errors].forEach(error => this.setSnackbar({ color: 'error', text: error }))
      } else {
        this.step !== this.steps ? this.step++ : null
      }
    },
    addUserData() {
      console.log(this.userData)
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.create(this.userData).then(response => {
          console.log(response)
          this.$router.push({ name: 'MealPlan' }).then(() => this.setSnackbar({ color: 'success', text: response.data.message }))
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    }
  },
  watch: {
    currentWeight(value) {
      value < 0 ? this.userData.currentWeight = 0 : null
    },
    goalWeight(value) {
      value < 0 ? this.userData.goalWeight = 0 : null
    },
    height(value) {
      value < 0 ? this.userData.height = 0 : null
    },
    menu(value) {
      value && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    activityIndex(value) {
      this.userData.activityLevel = this.activities.labels[value]
    }
  }
}
</script>

<style>
.chip-group span {
  width: 150px;
  justify-content: center;
}
.chip-group div {
  justify-content: center;
}
.v-slider__thumb {
  cursor: grab;
}
</style>