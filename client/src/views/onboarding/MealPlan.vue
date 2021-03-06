<template>
  <v-container v-if="userData.accountId">
    <h5 class="text-h5 text-center">Your <strong>meal plan</strong> is ready!</h5>
    <v-card class="mt-5" rounded>
      <v-row>
        <v-col cols="12">
          <v-card-text class="text-uppercase font-weight-bold pb-0 success--text">STEP 1</v-card-text>
          <v-card-title>Calorie Goals</v-card-title>
          <v-card-text>Start by picking a calorie goal based on whether you want to maintain, lose weight, or build muscle.</v-card-text>
          <v-divider />
        </v-col>
        <v-col cols="12">
          <v-slide-group v-model="caloriesGoal" show-arrows center-active>
            <v-slide-item v-for="goal in mealGoals" :key="goal.title" v-slot="{ active, toggle }">
              <v-btn class="mx-2" :color="goal.title === range.title ? mealGoals[caloriesGoal].color : ''"
                  :input-value="active" depressed rounded @click="toggle">
                {{ goal.title }}
              </v-btn>
            </v-slide-item>
          </v-slide-group>
        </v-col>
        <v-col cols="12" class="d-flex justify-center pb-0">
          <round-slider
              v-model="userData.TDEE"
              line-cap="round"
              circleShape="half-top"
              start-angle="315"
              :radius="$vuetify.breakpoint.xsOnly ? '100' : $vuetify.breakpoint.mdAndDown ? '250' : $vuetify.breakpoint.lg ? '300' : '350'"
              :rangeColor="range.color"
              :min="minValue"
              :max="maxValue"
              :step="calorieStep"
              :update="sliderChange"
          />
        </v-col>
        <v-col class="d-flex justify-center pt-0">
          <v-card-title class="text-subtitle-1 py-0">Adjusted daily calories requirement to meet your weight goal</v-card-title>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mt-5" rounded>
      <v-row>
        <v-col cols="12">
          <v-card-text class="text-uppercase font-weight-bold pb-0 success--text">STEP 2</v-card-text>
          <v-card-title>Macronutrient Goals</v-card-title>
          <v-card-text>Calculate your macronutrient goals based on your preferred diet or set your custom goals.</v-card-text>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="1" class="d-flex justify-center align-center">
          <v-select v-model="userData.selectedPlan" :items="getPlans"
                    item-text="title" color="success" item-color="success" label="Select the macros ratio"
                    return-object single-line />
        </v-col>
        <v-col cols="4">
          <DoughnutChart :user="user" />
        </v-col>
      </v-row>
      <v-divider class="mt-5" />
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-flex class="d-flex flex-row justify-center">
            <v-card-text class="my-0 py-0 pl-2 d-flex flex-column">
              <v-subheader class="text-subtitle-1">
                <v-icon class="mr-1" color="red">mdi-nutrition</v-icon>
                <label>Net Carbs</label>
              </v-subheader>
              <v-subheader v-if="selectedPlan.title" class="text-subtitle-2 grey--text">
                <span>Based on the {{ selectedPlan.title }} diet.</span>
                <span v-if="isCustomPlan" class="ml-1">Slide to modify.</span>
              </v-subheader>
            </v-card-text>
            <v-card-actions class="px-5 d-flex flex-column align-end py-0">
              <v-text-field
                  v-model="userData.macros.CARBS"
                  type="number"
                  color="success"
                  class="input-number pt-0 mt-0"
                  suffix="g"
                  :disabled="!isCustomPlan"
                  hide-spin-buttons
              >
                <template v-slot:prepend v-if="isCustomPlan">
                  <v-btn icon color="success"
                         :disabled="!isCustomPlan || userData.macros.CARBS <= 0"
                         :style="{ cursor: userData.macros.CARBS <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                         @click="decrement('CARBS')">
                    <v-icon>mdi-numeric-negative-1</v-icon>
                  </v-btn>
                </template>
                <template v-slot:append-outer v-if="isCustomPlan">
                  <v-btn icon color="success" :disabled="!isCustomPlan" @click="increment('CARBS')">
                    <v-icon>mdi-numeric-positive-1</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-subheader class="text-subtitle-1 font-weight-bold" style="color: #E53935">{{ percentageCarbs }}%</v-subheader>
            </v-card-actions>
          </v-flex>
          <v-slider v-if="userData.macros.CARBS >= 0" v-model="userData.macros.CARBS" color="red" class="px-5" :max="maxCarbs" :readonly="!isCustomPlan" hide-details />
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-flex class="d-flex flex-row justify-center">
            <v-card-text class="my-0 py-0 pl-2 d-flex flex-column">
              <v-subheader class="text-subtitle-1">
                <v-icon class="mr-1" color="light-blue">mdi-nutrition</v-icon>
                <label>Protein</label>
              </v-subheader>
              <v-subheader v-if="selectedPlan.title" class="text-subtitle-2 grey--text">
                <span>Based on the {{ selectedPlan.title }} diet.</span>
                <span v-if="isCustomPlan" class="ml-1">Slide to modify.</span>
              </v-subheader>
            </v-card-text>
            <v-card-actions class="px-5 d-flex flex-column align-end py-0">
              <v-text-field
                  v-model="userData.macros.PROTEIN"
                  type="number"
                  color="success"
                  class="input-number pt-0 mt-0"
                  suffix="g"
                  :disabled="!isCustomPlan"
                  hide-spin-buttons
              >
                <template v-slot:prepend v-if="isCustomPlan">
                  <v-btn icon color="success"
                         :disabled="!isCustomPlan || userData.macros.PROTEIN <= 0"
                         :style="{ cursor: userData.macros.PROTEIN <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                         @click="decrement('PROTEIN')">
                    <v-icon>mdi-numeric-negative-1</v-icon>
                  </v-btn>
                </template>
                <template v-slot:append-outer v-if="isCustomPlan">
                  <v-btn icon color="success" :disabled="!isCustomPlan" @click="increment('PROTEIN')">
                    <v-icon>mdi-numeric-positive-1</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-subheader class="text-subtitle-1 font-weight-bold" style="color: #03A9F4">{{ percentageProtein }}%</v-subheader>
            </v-card-actions>
          </v-flex>
          <v-slider v-if="userData.macros.PROTEIN >= 0" v-model="userData.macros.PROTEIN" color="light-blue" class="px-5" :max="maxProtein" :readonly="!isCustomPlan" hide-details />
        </v-col>
        <v-col cols="12">
          <v-flex class="d-flex flex-row justify-center">
            <v-card-text class="my-0 py-0 pl-2 d-flex flex-column">
              <v-subheader class="text-subtitle-1">
                <v-icon class="mr-1" color="orange">mdi-nutrition</v-icon>
                <label>Fat</label>
              </v-subheader>
              <v-subheader v-if="selectedPlan.title" class="text-subtitle-2 grey--text">
                <span>Based on the {{ selectedPlan.title }} diet.</span>
                <span v-if="isCustomPlan" class="ml-1">Slide to modify.</span>
              </v-subheader>
            </v-card-text>
            <v-card-actions class="px-5 d-flex flex-column align-end py-0">
              <v-text-field
                  v-model.number="userData.macros.FAT"
                  type="number"
                  color="success"
                  class="input-number pt-0 mt-0"
                  suffix="g"
                  :disabled="!isCustomPlan"
                  hide-spin-buttons
              >
                <template v-slot:prepend v-if="isCustomPlan">
                  <v-btn icon color="success"
                         :disabled="!isCustomPlan || userData.macros.FAT <= 0"
                         :style="{ cursor: userData.macros.FAT <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                         @click="decrement('FAT')">
                    <v-icon>mdi-numeric-negative-1</v-icon>
                  </v-btn>
                </template>
                <template v-slot:append-outer v-if="isCustomPlan">
                  <v-btn icon color="success" :disabled="!isCustomPlan" @click="increment('FAT')">
                    <v-icon>mdi-numeric-positive-1</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-subheader class="text-subtitle-1 font-weight-bold" style="color: #FF9800">{{ percentageFat }}%</v-subheader>
            </v-card-actions>
          </v-flex>
          <v-slider v-if="userData.macros.FAT >= 0" v-model="userData.macros.FAT" color="orange" class="px-5" :max="maxFat" :readonly="!isCustomPlan" hide-details />
        </v-col>
        <v-col cols="12" class="px-10">
          <v-btn block color="success" @click="onCreatePlan">
            <v-icon class="mr-1">mdi-clipboard-check</v-icon>
            <span>Apply meal plan</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <template>
      <v-flex class="text-center">
        <v-dialog v-model="caloriesMismatch" width="500">
          <v-card>
            <v-card-title class="text-h5 success">Calories Mismatch</v-card-title>
            <v-card-text class="mt-5">
              You entered a calories goal of {{ TDEE }}, but your macros add up to {{ this.macrosCalories }} calories.
              Please change your macros proportions or set a new calories goal.
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" text block @click="caloriesMismatch = false">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </template>
  </v-container>
</template>

<script>
import RoundSlider from 'vue-round-slider'
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import DoughnutChart from "@/components/charts/mealPlanDoughnut";

export default {
  name: "MealPlan",
  components: { DoughnutChart, RoundSlider },
  props: {
    user: {
      type: Object,
      default: null
    },
  },
  metaInfo: {
    title: 'Meal Plan'
  },
  data: () => ({
    mealGoals: [
      {
        title: 'Lose weight',
        color: '#E53935',
        range: [-35, -4]
      },
      {
        title: 'Maintain',
        color: '#FF9100',
        range: [-4, 4]
      },
      {
        title: 'Gain muscle',
        color: '#00E676',
        range: [4, 35]
      }
    ],
    range: {},
    userData: {
      selectedPlan: {},
      macros: {}
    },
    caloriesGoal: null,
    minValue: null,
    maxValue: null,
    calorieStep: null,
    maxPercentageCalorieDifference: 35,
    percentageCalorieDifference: 0,
    weightPerWeek: 0.5,
    loading: false,
    caloriesMismatch: false,
  }),
  created() {
    this.getAll().then(() => {
      if (this.getPlans.length) {
        this.getData()
      } else if (this.user.role === 'Admin') {
        this.$router.push({ name: 'MealPlans' }).then(() => {
          this.setSnackbar({ color: 'error', text: 'Please create at least 1 meal plan' })
        })
      } else {
        this.$router.push({ name: 'Login' }).then(() => {
          this.setSnackbar({ color: 'error', text: 'There are no meal plans in the database at the moment, please try again later' })
        })
      }
    }).catch(error => this.setSnackbar({ color: 'error', text: error.response.data.message } ))
  },
  computed: {
    ...mapGetters('userData', ['getUserData']),
    ...mapGetters('mealPlan', ['getPlans', 'getSelectedPlan']),
    age() {
      return this.userData.age || moment(new Date()).diff(moment(new Date(this.userData.birthdayDate)), 'years')
    },
    activityCoefficient() {
      const activity = this.userData.activityLevel
      return activity === 'Sedentary' ? 1.2 : activity === 'Light' ? 1.375 : activity === 'Moderate' ? 1.55
          : activity === 'Very' ? 1.725 : activity === 'Extra' ? 1.9 : undefined
    },
    TDEE() {
      return this.userData.TDEE
    },
    fixedTDEE() {
      return this.fixedNumber(this.userData.BMR * this.activityCoefficient)
    },
    weightGoal() {
      return this.userData.goalWeight < this.userData.currentWeight ? 0 : this.userData.goalWeight > this.userData.currentWeight ? 2 : 1
    },
    weightDifference() {
      return this.userData.currentWeight - this.userData.goalWeight
    },
    calorieDifference() {
      return (this.weightDifference * 750) / (this.weightDifference / this.weightPerWeek)
    },
    selectedPlan() {
      return this.userData?.selectedPlan
    },
    isCustomPlan() {
      return this.userData.selectedPlan ? this.userData.selectedPlan.title === 'Custom' : false
    },
    macrosTotal() {
      return this.userData.macros.CARBS + this.userData.macros.PROTEIN + (this.userData.macros.FAT * 2.25)
    },
    macrosCalories() {
      return this.macrosTotal * 4
    },
    maxCarbs() {
      return this.fixedNumber(this.userData.TDEE / 4)
    },
    maxProtein() {
      return this.fixedNumber(this.userData.TDEE / 4)
    },
    maxFat() {
      return this.fixedNumber(this.userData.TDEE / 9)
    },
    percentageCarbs() {
      return this.fixedNumber(this.userData.macros.CARBS * 100 / this.macrosTotal)
    },
    percentageProtein() {
      return this.fixedNumber(this.userData.macros.PROTEIN * 100 / this.macrosTotal)
    },
    percentageFat() {
      return this.fixedNumber((this.userData.macros.FAT * 2.25) * 100 / this.macrosTotal)
    },
  },
  methods: {
    ...mapActions('mealPlan', ['getAll', 'setSelectedPlan']),
    ...mapActions('notification', ['setAlert', 'setSnackbar']),
    ...mapActions('userData', ['getById', 'update']),
    sliderChange(slider) {
      let currentRange
      this.mealGoals.forEach(mealGoal => mealGoal.range[0] <= slider.value && mealGoal.range[1] >= slider.value ? currentRange = mealGoal : null)
      this.caloriesGoal = this.mealGoals.findIndex(mealGoal => mealGoal.title === currentRange.title)
    },
    fixedNumber(formula) {
      return Number.parseInt((formula).toFixed(0))
    },
    increment(key) {
      this.userData.macros[key] = parseInt(this.userData.macros[key],10) + 1
    },
    decrement(key) {
      this.userData.macros[key] = parseInt(this.userData.macros[key],10) - 1
    },
    setMacros() {
      this.userData.macros.CARBS = this.fixedNumber((this.userData.selectedPlan.proportions.CARBS / 100) * this.userData.TDEE / 4)
      this.userData.macros.PROTEIN = this.fixedNumber((this.userData.selectedPlan.proportions.PROTEIN / 100) * this.userData.TDEE / 4)
      this.userData.macros.FAT = this.fixedNumber((this.userData.selectedPlan.proportions.FAT / 100) * this.userData.TDEE / 9)
    },
    setCaloriesGoal(value) {
      if (value === 0) this.userData.TDEE = this.fixedTDEE - this.calorieDifference
      else if (value === 2) this.userData.TDEE = this.fixedTDEE + this.calorieDifference
      else this.userData.TDEE = this.fixedTDEE
      this.caloriesGoal = value
      Object.assign(this.range, this.mealGoals[value])
    },
    getData() {
      this.getById(this.user.id).then(() => {
        this.getUserData.subscribe(userData => this.userData = userData)
        if (!this.userData.currentWeight || !this.userData?.goalWeight || !this.userData?.height || !this.userData?.sex || !this.userData?.birthdayDate || !this.userData?.activityLevel) {
          this.$router.push({ name: 'Onboarding' }).then(() => {
            this.setSnackbar({ color: 'error', text: 'Not enough user data' })
            this.setAlert({ type: 'info', text: 'To continue using this service, we need to collect data about you and prepare it for the formation and setting of goals for daily calories and macronutrients.' })
          })
        }
        if (!this.userData.BMR) {
          if (this.userData.sex === 'male') {
            this.userData.BMR = 10 * this.userData.currentWeight + 6.25 * this.userData.height - 5 * this.age + 5
          } else {
            this.userData.BMR = 10 * this.userData.currentWeight + 6.25 * this.userData.height - 5 * this.age - 161
          }
        }
        if (!this.userData.TDEE) this.userData.TDEE = this.fixedTDEE
        this.minValue = this.fixedNumber(this.fixedTDEE - this.fixedTDEE * this.maxPercentageCalorieDifference / 100)
        this.maxValue = this.fixedNumber(this.fixedTDEE + this.fixedTDEE * this.maxPercentageCalorieDifference / 100)
        this.calorieStep = this.fixedNumber(this.fixedTDEE / 100)
        this.mealGoals.forEach(mealGoal => {
          mealGoal.range[0] = this.fixedNumber(this.fixedTDEE + this.fixedTDEE * mealGoal.range[0] / 100)
          mealGoal.range[1] = this.fixedNumber(this.fixedTDEE + this.fixedTDEE * mealGoal.range[1] / 100)
        })
        if (!this.userData.selectedPlan) this.userData.selectedPlan = this.getPlans[0]
        !this.userData?.caloriesGoal ? this.caloriesGoal = this.weightGoal : this.caloriesGoal = this.mealGoals.findIndex(mealGoal => mealGoal.title === this.userData.caloriesGoal)
        Object.assign(this.range, this.mealGoals[this.caloriesGoal])
        if (!this.userData.macros) {
          this.userData.macros = {
            CARBS: null,
            PROTEIN: null,
            FAT: null,
          }
        }
      }).catch(error => {
        this.$router.push({ name: 'Onboarding' }).then(() => {
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        })
      })
    },
    onCreatePlan() {
      if (this.macrosCalories + 25 < this.TDEE || this.macrosCalories - 25 > this.TDEE) this.caloriesMismatch = true
      else {
        this.loading = true
        const payload = {}
        Object.assign(payload, this.userData)
        payload.caloriesGoal = this.mealGoals[this.caloriesGoal].title
        payload.selectedPlan = this.selectedPlan.id
        if (this.isCustomPlan) payload.customProportions = this.userData.selectedPlan.proportions
        this.update(payload).then(response => {
          this.$router.push({ name: 'DailyLog' }).then(() => this.setSnackbar({ color: 'success', text: response.data.message }))
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    }
  },
  watch: {
    caloriesGoal(value, prev) {
      if ([0, 1, 2].includes(value) && !this.userData.caloriesGoal) this.setCaloriesGoal(value)
      else if ([0, 1, 2].includes(value) && this.userData.caloriesGoal && prev !== null) this.setCaloriesGoal(value)
      else if (value === undefined) this.caloriesGoal = prev
      this.setMacros()
    },
    TDEE(value) {
      this.percentageCalorieDifference = this.fixedNumber(value * 100 / this.fixedTDEE - 100)
      this.setMacros()
    },
    selectedPlan(value) {
      if (!this.isCustomPlan) delete this.userData.customProportions
      this.setSelectedPlan(value)
      this.setMacros()
    },
    percentageCarbs(value) {
      if (value) {
        this.userData.selectedPlan.proportions.CARBS = value
        this.userData.selectedPlan.proportions.PROTEIN = this.percentageProtein
        this.userData.selectedPlan.proportions.FAT = this.percentageFat
        this.setSelectedPlan(this.userData.selectedPlan)
      }
    },
  },
}
</script>