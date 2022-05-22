<template>
  <v-container>
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
          <v-card-text class="pt-0 text-subtitle-2">I want to</v-card-text>
          <v-slide-group v-model="mealGoal" show-arrows center-active>
            <v-slide-item v-for="goal in mealGoals" :key="goal.title" v-slot="{ active, toggle }">
              <v-btn class="mx-2" :color="goal.title === range.title ? mealGoals[mealGoal].color : ''" :input-value="active" depressed rounded @click="toggle">
                {{ goal.title }}
              </v-btn>
            </v-slide-item>
          </v-slide-group>
        </v-col>
        <v-col cols="12" class="d-flex justify-center pb-0">
          <round-slider
              v-model="TDEE"
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
          <v-card-text>Let's calculate your macronutrient goals based on your preferred diet. Or set your custom goals.</v-card-text>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" offset="1" class="d-flex justify-center align-center">
          <v-select v-model="selectedDiet" :items="getDiets"
                    item-text="title" color="success" item-color="success" label="Select the macros ratio"
                    return-object single-line />
        </v-col>
        <v-col cols="4">
          <DoughnutChart />
        </v-col>
      </v-row>
      <v-divider class="mt-5" />
      <v-row>
        <v-col cols="12">
          <div class="d-flex flex-row justify-center">
            <v-card-text class="pb-0 pl-2 d-flex flex-column">
              <v-subheader class="text-subtitle-1">
                <v-icon class="mr-1" :color="'#E53935'">mdi-nutrition</v-icon>
                <label>Net Carbs</label>
              </v-subheader>
              <v-subheader class="text-subtitle-2 grey--text">
                Based on the {{ selectedDiet.title }} diet.
                <span v-if="isCustomPlan" class="ml-1">Slide to modify.</span>
              </v-subheader>
            </v-card-text>
            <v-card-actions class="px-5 d-flex flex-column align-end py-0">
              <v-text-field
                  v-model="macros.CARBS"
                  type="number"
                  class="input-number"
                  suffix="g"
                  append-outer-icon="mdi-plus"
                  @click:append-outer="increment('CARBS')"
                  :disabled="!isCustomPlan"
                  hide-spin-buttons
              >
                <template v-slot:prepend>
                  <v-btn icon
                         :disabled="!isCustomPlan || macros.CARBS <= 0"
                         :style="{ cursor: macros.CARBS <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                         @click="decrement('CARBS')">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-subheader class="text-subtitle-1 font-weight-bold" style="color: #E53935">{{ percentageCarbs }}%</v-subheader>
            </v-card-actions>
          </div>
          <v-slider v-model="macros.CARBS" :max="maxCarbs" class="px-5" :color="'#E53935'" :readonly="!isCustomPlan"></v-slider>
        </v-col>
        <v-col cols="12">
          <div class="d-flex flex-row justify-center">
            <v-card-text class=" pb-0 pl-2 d-flex flex-column">
              <v-subheader class="text-subtitle-1">
                <v-icon class="mr-1" :color="'#1565C0'">mdi-nutrition</v-icon>
                <label>Protein</label>
              </v-subheader>
              <v-subheader class="text-subtitle-2 grey--text">Based on the {{ selectedDiet.title }} diet. Slide to modify.</v-subheader>
            </v-card-text>
            <v-card-actions class="px-5 d-flex flex-column align-end py-0">
              <v-text-field
                  v-model="macros.PROTEIN"
                  type="number"
                  class="input-number"
                  suffix="g"
                  append-outer-icon="mdi-plus"
                  @click:append-outer="increment('PROTEIN')"
                  :disabled="!isCustomPlan"
                  hide-spin-buttons
              >
                <template v-slot:prepend>
                  <v-btn icon
                         :disabled="!isCustomPlan || macros.PROTEIN <= 0"
                         :style="{ cursor: macros.PROTEIN <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                         @click="decrement('PROTEIN')">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-subheader class="text-subtitle-1 font-weight-bold" style="color: #1565C0">{{ percentageProtein }}%</v-subheader>
            </v-card-actions>
          </div>
          <v-slider v-model="macros.PROTEIN" :max="maxProtein" class="px-5" :color="'#1565C0'" :readonly="!isCustomPlan"></v-slider>
        </v-col>
        <v-col cols="12">
          <div class="d-flex flex-row justify-center">
            <v-card-text class=" pb-0 pl-2 d-flex flex-column">
              <v-subheader class="text-subtitle-1">
                <v-icon class="mr-1" :color="'#FF9100'">mdi-nutrition</v-icon>
                <label>Fat</label>
              </v-subheader>
              <v-subheader class="text-subtitle-2 grey--text">Based on the {{ selectedDiet.title }} diet. Slide to modify.</v-subheader>
            </v-card-text>
            <v-card-actions class="px-5 d-flex flex-column align-end py-0">
              <v-text-field
                  v-model.number="macros.FAT"
                  type="number"
                  class="input-number"
                  suffix="g"
                  append-outer-icon="mdi-plus"
                  @click:append-outer="increment('FAT')"
                  :disabled="!isCustomPlan"
                  hide-spin-buttons
              >
                <template v-slot:prepend>
                  <v-btn icon
                         :disabled="!isCustomPlan || macros.FAT <= 0"
                         :style="{ cursor: macros.FAT <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                         @click="decrement('FAT')">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <v-subheader class="text-subtitle-1 font-weight-bold" style="color: #FF9100">{{ percentageFat }}%</v-subheader>
            </v-card-actions>
          </div>
          <v-slider v-model="macros.FAT" :max="maxFat" class="px-5" :color="'#FF9100'" :readonly="!isCustomPlan"></v-slider>
        </v-col>
        <v-col cols="12" class="px-10">
          <v-btn color="success" @click="onCreatePlan" block>Apply meal plan</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import RoundSlider from 'vue-round-slider'
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import DoughnutChart from "@/components/Doughnut";

export default {
  name: "MealPlan",
  components: { DoughnutChart, RoundSlider },
  props: {
    user: {
      type: Object,
      default: null
    },
  },
  data: () => ({
    mealGoal: 1,
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
    userData: null,
    BMR: null,
    TDEE: null,
    minValue: null,
    maxValue: null,
    calorieStep: null,
    maxPercentageCalorieDifference: 35,
    percentageCalorieDifference: 0,
    weightPerWeek: 0.5,
    selectedDiet: {},
    macros: {
      CARBS: null,
      PROTEIN: null,
      FAT: null
    },
    loading: false
  }),
  created() {
    Object.assign(this.selectedDiet, this.getDiets[6])
    this.setUserDiet(this.selectedDiet)
    this.getById(this.user.id).then(() => {
      this.getUserData.subscribe(userData => this.userData = userData)
      if (this.userData.sex === 'male') {
        this.BMR = 10 * this.userData.currentWeight + 6.25 * this.userData.height - 5 * this.age + 5
      }
      else {
        this.BMR = 10 * this.userData.currentWeight + 6.25 * this.userData.height - 5 * this.age - 161
      }
      this.TDEE = this.fixedTDEE
      this.minValue = this.fixedNumber(this.TDEE - this.TDEE * this.maxPercentageCalorieDifference / 100)
      this.maxValue = this.fixedNumber(this.TDEE + this.TDEE * this.maxPercentageCalorieDifference / 100)
      this.calorieStep = this.fixedNumber(this.TDEE / 100)
      this.mealGoals.forEach(mealGoal => {
        mealGoal.range[0] = this.fixedNumber(this.fixedTDEE + this.fixedTDEE * mealGoal.range[0] / 100)
        mealGoal.range[1] = this.fixedNumber(this.fixedTDEE + this.fixedTDEE * mealGoal.range[1] / 100)
      })
      this.mealGoal = this.weightGoal
      Object.assign(this.range, this.mealGoals[1])
      console.log(this.userData.activityLevel)
      console.log(this.activityCoefficient)
      console.log(this.BMR)
      console.log(this.TDEE)
      console.log(this.calorieStep)

    }).catch(error => {
      this.$router.push({ name: 'Onboarding' }).then(() => this.setSnackbar({ color: 'error', text: error.response.data.message }))
    })
  },
  computed: {
    ...mapGetters('userData', ['getUserData', 'getDiets', 'getUserDiet']),
    age() {
      return moment(new Date()).diff(moment(new Date(this.userData.birthdayDate)), 'years')
    },
    activityCoefficient() {
      const activity = this.userData.activityLevel
      return activity === 'Sedentary' ? 1.2 : activity === 'Light' ? 1.375 : activity === 'Moderate' ? 1.55
          : activity === 'Very' ? 1.725 : activity === 'Extra' ? 1.9 : undefined
    },
    fixedTDEE() {
      return this.fixedNumber(this.BMR * this.activityCoefficient)
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
    isCustomPlan() {
      return this.selectedDiet.title === 'Custom'
    },
    macrosTotal() {
      return this.macros.CARBS + this.macros.PROTEIN + (this.macros.FAT * 2.25)
    },
    maxCarbs() {
      return this.fixedNumber(this.TDEE / 4)
    },
    maxProtein() {
      return this.fixedNumber(this.TDEE / 4)
    },
    maxFat() {
      return this.fixedNumber(this.TDEE / 9)
    },
    percentageCarbs() {
      return this.fixedNumber(this.macros.CARBS * 100 / this.macrosTotal)
    },
    percentageProtein() {
      return this.fixedNumber(this.macros.PROTEIN * 100 / this.macrosTotal)
    },
    percentageFat() {
      return this.fixedNumber((this.macros.FAT * 2.25) * 100 / this.macrosTotal)
    },
  },
  methods: {
    ...mapActions({
      getById: 'userData/getById',
      setUserDiet: 'userData/setUserDiet',
      createMealPlan: 'mealPlan/create',
      setSnackbar: 'notification/setSnackbar'
    }),
    sliderChange(slider) {
      let currentRange
      this.mealGoals.forEach(mealGoal => mealGoal.range[0] <= slider.value && mealGoal.range[1] >= slider.value ? currentRange = mealGoal : null)
      this.mealGoal = this.mealGoals.findIndex(mealGoal => mealGoal.title === currentRange.title)
    },
    fixedNumber(formula) {
      return Number.parseInt((formula).toFixed(0))
    },
    increment(key) {
      this.macros[key] = parseInt(this.macros[key],10) + 1
    },
    decrement(key) {
      this.macros[key] = parseInt(this.macros[key],10) - 1
    },
    setMacros() {
      this.macros.CARBS = this.fixedNumber((this.selectedDiet.proportions.CARBS / 100) * this.TDEE / 4)
      this.macros.PROTEIN = this.fixedNumber((this.selectedDiet.proportions.PROTEIN / 100) * this.TDEE / 4)
      this.macros.FAT = this.fixedNumber((this.selectedDiet.proportions.FAT / 100) * this.TDEE / 9)
    },
    onCreatePlan() {
      this.loading = true
      const mealGoal = this.mealGoals[this.mealGoal].title
      const [accountId, BMR, TDEE, macros, selectedDiet] = [this.user.id, this.BMR, this.TDEE, this.macros, this.selectedDiet]
      const payload = {
        accountId,
        mealGoal,
        BMR,
        TDEE,
        macros,
        selectedDiet
      }
      this.createMealPlan(payload).then(response => {
        console.log(response)
        this.$router.push({ name: 'DailyLog' }).then(() => this.setSnackbar({ color: 'success', text: response.data.message }))
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.loading = false)
    }
  },
  watch: {
    mealGoal(value, prev) {
      if ([0, 1, 2].includes(value)) {
        Object.assign(this.range, this.mealGoals[value])
        // if (value === 0) this.TDEE = this.fixedTDEE - this.fixedTDEE * (this.maxPercentageCalorieDifference - 21) / 100
        // else if (value === 2) this.TDEE = this.fixedTDEE + this.fixedTDEE * (this.maxPercentageCalorieDifference - 21) / 100
        if (value === 0) this.TDEE = this.fixedTDEE - this.calorieDifference
        else if (value === 2) this.TDEE = this.fixedTDEE + this.calorieDifference
        else this.TDEE = this.fixedTDEE
      } else {
        this.mealGoal = prev
        this.TDEE -= this.calorieDifference
      }
    },
    TDEE(value) {
      this.percentageCalorieDifference = this.fixedNumber(value * 100 / this.fixedTDEE - 100)
      this.setMacros()
    },
    selectedDiet(value) {
      this.setUserDiet(value)
      this.setMacros()
    },
    percentageCarbs(value) {
      if (value) {
        this.selectedDiet.proportions.CARBS = value
        this.selectedDiet.proportions.PROTEIN = this.percentageProtein
        this.selectedDiet.proportions.FAT = this.percentageFat
        this.setUserDiet(this.selectedDiet)
      }
    },
  },
}
</script>