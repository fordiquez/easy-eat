<template>
  <v-container>
    <v-row>
      <v-col cols="10" sm="5" md="5">
        <span class="text-h5">{{ greetingsTitle }}</span>
      </v-col>
      <v-col cols="10" sm="5" md="5" offset="1" offset-sm="0" class="d-flex justify-sm-start justify-center">
        <v-btn @click="changeDay(-1)" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-dialog v-model="dateDialog" :return-value.sync="date" ref="dialog" width="350px" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" text>
              <v-icon class="mr-2">mdi-calendar</v-icon>
              <span>{{ date | moment }}</span>
            </v-btn>
          </template>
          <v-date-picker v-model="date" color="success" scrollable show-adjacent-months reactive full-width>
            <v-btn text color="teal" @click="dateDialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="success" @click="$refs.dialog.save(date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
        <v-btn @click="changeDay(1)" icon>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-speed-dial v-model="fab" absolute right top direction="bottom" class="mr-5" transition="scroll-x-transition">
          <template v-slot:activator>
            <v-btn v-model="fab" color="green accent-4" fab>
              <v-icon v-if="fab">mdi-close</v-icon>
              <v-icon v-else>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-tooltip left color="green">
            <template v-slot:activator="{ on, attrs }">
              <v-btn fab small color="green" v-on="on" v-bind="attrs" @click="onFoodSearchDialog">
                <v-icon>mdi-hamburger-plus</v-icon>
              </v-btn>
            </template>
            <span>Add Daily Food</span>
          </v-tooltip>
          <v-tooltip left color="green">
            <template v-slot:activator="{ on, attrs }">
              <v-btn fab small color="green" v-on="on" v-bind="attrs" @click="onCustomFoodDialog">
                <v-icon>mdi-playlist-plus</v-icon>
              </v-btn>
            </template>
            <span>Create Custom Food</span>
          </v-tooltip>
        </v-speed-dial>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col v-if="getApplication.dailyMacrosPie" cols="12" sm="6" md="4" lg="3" class="d-flex flex-column align-center">
        <v-card-title class="justify-center py-0">My Macros</v-card-title>
        <daily-macros-pie v-if="getDailyMacros.CALS" />
        <v-flex v-else class="mt-5 grey darken-3 rounded-circle" style="width: 175px; height: 175px" />
      </v-col>
      <v-col v-if="getApplication.tracker" cols="12" sm="10" md="4" lg="6" class="justify-center" :class="$vuetify.breakpoint.smAndDown ? 'order-1' : ''">
        <v-flex class="d-flex justify-space-between">
          <v-card-text class="pa-0">
            <v-icon class="mr-1" color="red">mdi-nutrition</v-icon>
            <label class="text-subtitle-2">Net Carbs</label>
          </v-card-text>
          <v-card-text class="pa-0" style="max-width: max-content">
            <label class="font-weight-bold red--text">{{ getDailyMacros.CARBS | zeroFixed }}</label>
            <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text"> / {{ userMacrosCarbs }}g</label>
          </v-card-text>
        </v-flex>
        <v-progress-linear class="mb-3 mt-2" color="red" :value="dailyPercentageCarbs" height="15" rounded>
          <label class="text-subtitle-2 font-italic blue-grey--text text--lighten-5">
            {{ carbsSign === 'left' ? carbsLeft : carbsOver }}g {{ carbsSign }}
          </label>
        </v-progress-linear>
        <v-flex class="d-flex justify-space-between">
          <v-card-text class="pa-0">
            <v-icon class="mr-1" color="light-blue">mdi-nutrition</v-icon>
            <label class="text-subtitle-2">Protein</label>
          </v-card-text>
          <v-card-text class="pa-0" style="max-width: max-content">
            <label class="font-weight-bold light-blue--text">{{ getDailyMacros.PROTEIN | zeroFixed }}</label>
            <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text"> / {{ userMacrosProtein }}g</label>
          </v-card-text>
        </v-flex>
        <v-progress-linear class="mb-3 mt-2" color="light-blue" :value="dailyPercentageProtein" height="15" rounded>
          <label class="text-subtitle-2 font-italic blue-grey--text text--lighten-5">
            {{ proteinSign === 'left' ? proteinLeft : proteinOver }}g {{ proteinSign }}
          </label>
        </v-progress-linear>
        <v-flex class="d-flex justify-space-between">
          <v-card-text class="pa-0">
            <v-icon class="mr-1" color="orange">mdi-nutrition</v-icon>
            <label class="text-subtitle-2">Fat</label>
          </v-card-text>
          <v-card-text class="pa-0" style="max-width: max-content">
            <label class="font-weight-bold orange--text">{{ getDailyMacros.FAT | zeroFixed }}</label>
            <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text"> / {{ userMacrosFat }}g</label>
          </v-card-text>
        </v-flex>
        <v-progress-linear class="mb-3 mt-2" color="orange" :value="dailyPercentageFat" height="15" rounded>
          <label class="text-subtitle-2 font-italic blue-grey--text text--lighten-5">
            {{ fatSign === 'left' ? fatLeft : fatOver }}g {{ fatSign }}
          </label>
        </v-progress-linear>
        <v-flex class="d-flex justify-space-between">
          <v-card-text class="pa-0">
            <v-icon class="mr-1" color="teal">mdi-nutrition</v-icon>
            <label class="text-subtitle-2">Calories</label>
          </v-card-text>
          <v-card-text class="pa-0" style="max-width: max-content">
            <label class="font-weight-bold teal--text">{{ getDailyMacros.CALS | zeroFixed }}</label>
            <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text"> / {{ userCals }}</label>
          </v-card-text>
        </v-flex>
        <v-progress-linear class="mb-3 mt-2" color="teal" :value="dailyPercentageCals" height="15" rounded>
          <label class="text-subtitle-2 font-italic blue-grey--text text--lighten-5">
            {{ calsSign === 'left' ? calsLeft : calsOver }} {{ calsSign }}
          </label>
        </v-progress-linear>
      </v-col>
      <v-col v-if="getApplication.macrosGoalsPie" cols="12" sm="6" md="4" lg="3" class="d-flex flex-column align-center">
        <v-card-title class="justify-center py-0">My Goals</v-card-title>
        <macros-goals-pie v-if="isSelectedPlan" />
        <v-flex v-else class="mt-5 grey darken-3 rounded-circle" style="width: 175px; height: 175px" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <meal-time-list :meal-time="'Breakfast'" @food-search="onFoodSearchDialog" />
      </v-col>
      <v-col cols="12">
        <meal-time-list :meal-time="'Lunch'" @food-search="onFoodSearchDialog" />
      </v-col>
      <v-col cols="12">
        <meal-time-list :meal-time="'Dinner'" @food-search="onFoodSearchDialog" />
      </v-col>
      <v-col cols="12">
        <meal-time-list :meal-time="'Snack'" @food-search="onFoodSearchDialog" />
      </v-col>
    </v-row>

    <food-search-dialog
        v-if="foodSearchDialog"
        :food-search-dialog="foodSearchDialog"
        :food-item-dialog="foodItemDialog"
        @close-dialog="foodSearchDialog = false"
        @food-item="onFoodItemDialog"
    />

    <food-item
        v-if="foodItemDialog"
        :food-item-dialog="foodItemDialog"
        :selected-food="selectedFood"
        :selected-nutrients="selectedNutrients"
        @close-dialog="foodItemDialog = false"
    />

    <custom-food-dialog
        v-if="customFoodDialog"
        :custom-food-dialog="customFoodDialog"
        @close-dialog="customFoodDialog = false"
    />

  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import moment from "moment"
import MealTimeList from "@/components/MealTimeList";
import FoodItem from "@/components/dialogs/FoodItem";
import FoodSearchDialog from "@/components/dialogs/FoodSearch";
import dailyMacrosPie from "@/components/charts/dailyMacrosPie";
import macrosGoalsPie from "@/components/charts/macrosGoalsPie";
import CustomFoodDialog from "@/components/dialogs/CustomFood";

export default {
  name: 'DailyLog',
  components: {CustomFoodDialog, dailyMacrosPie, macrosGoalsPie, FoodSearchDialog, FoodItem, MealTimeList },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    fab: false,
    date: null,
    dateFormatted: null,
    year: null,
    month: null,
    day: null,
    dateDialog: false,
    foodSearchDialog: false,
    foodItemDialog: false,
    customFoodDialog: false,
    selectedFood: null,
    selectedNutrients: {
      CALS: null,
      CARBS: null,
      PROTEIN: null,
      FAT: null
    },
    userData: null
  }),
  created() {
    this.date = moment().format('yyyy-MM-DD')
    this.dateFormatted = this.computedDateFormatted
    this.getUserData.subscribe(userData => this.userData = userData)
    if (this.getDailyMacros) this.clearDailyMacros()
    this.validateUserData()
    this.loadUserFood()
  },
  computed: {
    ...mapGetters('food', ['getUserFood', 'getDailyMacros']),
    ...mapGetters('userData', ['getUserData']),
    ...mapGetters('application', ['getApplication']),
    greetingsTitle() {
      return this.user ? `Good ${this.timeOfDay(moment().hours())}, ` + this.user.firstName + '!' : 'Good' + this.timeOfDay(moment().hours())
    },
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
    userMacrosCarbs() {
      return this.userData?.macros?.CARBS
    },
    userMacrosProtein() {
      return this.userData?.macros?.PROTEIN
    },
    userMacrosFat() {
      return this.userData?.macros?.FAT
    },
    userCals() {
      return this.userData?.TDEE
    },
    dailyPercentageCarbs() {
      return this.getDailyMacros.CARBS * 100 / this.userMacrosCarbs
    },
    dailyPercentageProtein() {
      return this.getDailyMacros.PROTEIN * 100 / this.userMacrosProtein
    },
    dailyPercentageFat() {
      return this.getDailyMacros.FAT * 100 / this.userMacrosFat
    },
    dailyPercentageCals() {
      return this.getDailyMacros.CALS * 100 / this.userCals
    },
    carbsLeft() {
      return parseInt(this.userMacrosCarbs - this.getDailyMacros.CARBS, 10)
    },
    carbsOver() {
      return this.carbsLeft - this.carbsLeft * 2
    },
    carbsSign() {
      return this.carbsOver > this.carbsLeft ? 'over' : 'left'
    },
    proteinLeft() {
      return parseInt(this.userMacrosProtein - this.getDailyMacros.PROTEIN, 10)
    },
    proteinOver() {
      return this.proteinLeft - this.proteinLeft * 2
    },
    proteinSign() {
      return this.proteinOver > this.proteinLeft ? 'over' : 'left'
    },
    fatLeft() {
      return parseInt(this.userMacrosFat - this.getDailyMacros.FAT, 10)
    },
    fatOver() {
      return this.fatLeft - this.fatLeft * 2
    },
    fatSign() {
      return this.fatOver > this.fatLeft ? 'over' : 'left'
    },
    calsLeft() {
      return parseInt(this.userCals - this.getDailyMacros.CALS, 10)
    },
    calsOver() {
      return this.calsLeft - this.calsLeft * 2
    },
    calsSign() {
      return this.calsOver > this.calsLeft ? 'over' : 'left'
    },
    customMealTime() {
      const timeOfDay = this.timeOfDay(moment().hours())
      return timeOfDay === 'morning' ? 'Breakfast' : timeOfDay === 'day' ? 'Lunch' : timeOfDay === 'evening' ? 'Dinner' : 'Snack'
    },
    isSelectedPlan() {
      return !!this.userData?.selectedPlan
    }
  },
  methods: {
    ...mapActions('food', ['get', 'selectedDate', 'selectedMealTime', 'setDailyMacros', 'clearDailyMacros', 'clearFoundFood', 'clearLinks']),
    ...mapActions('userData', ['getById']),
    ...mapActions('notification', ['setSnackbar', 'setAlert']),
    formatDate(date) {
      if (date) [this.year, this.month, this.day] = date.split('-')
      return `${this.day}/${this.month}/${this.year}`
    },
    parseDate(date) {
      if (date) [this.month, this.day, this.year] = date.split('/')
      return `${this.year}-${this.month.padStart(2, '0')}-${this.day.padStart(2, '0')}`
    },
    changeDay(duration) {
      this.date = moment(this.date).add(duration, 'days').format('yyyy-MM-DD')
    },
    timeOfDay(hours) {
      return hours >= 0 && hours < 6 ? 'night' : hours >= 6 && hours < 12 ? 'morning' : hours >= 12 && hours < 15 ? 'day' : hours >= 15 && hours < 18 ? 'afternoon' : 'evening'
    },
    onFoodSearchDialog(mealTime) {
      if (typeof mealTime !== 'string') mealTime = this.customMealTime
      this.selectedMealTime(mealTime)
      this.foodSearchDialog = true
    },
    onFoodItemDialog(foodItem) {
      this.foodItemDialog = true
      this.selectedFood = foodItem.food
      const nutrients = {
        CALS: foodItem.food.nutrients.ENERC_KCAL || null,
        CARBS: foodItem.food.nutrients.CHOCDF || null,
        PROTEIN: foodItem.food.nutrients.PROCNT || null,
        FAT: foodItem.food.nutrients.FAT || null
      }
      this.selectedNutrients = Object.assign({}, nutrients)
    },
    onCustomFoodDialog() {
      this.selectedMealTime(this.customMealTime)
      this.customFoodDialog = true
    },
    validateUserData() {
      this.getById(this.user.id).then(() => {
        if (!this.userData.currentWeight || !this.userData?.goalWeight || !this.userData?.height || !this.userData?.sex || !this.userData?.birthdayDate || !this.userData?.activityLevel) {
          this.$router.push({ name: 'Onboarding' }).then(() => {
            this.setSnackbar({ color: 'error', text: 'Not enough user data' })
            this.setAlert({ type: 'info', text: 'To continue using this service, we need to collect data about you and prepare it for the formation and setting of goals for daily calories and macronutrients.' })
          })
        } else if (!this.userData?.TDEE || !this.userData?.macros || !this.userData?.selectedPlan) {
          this.$router.push({ name: 'MealPlan' }).then(() => {
            this.setSnackbar({ color: 'error', text: 'Not enough user data' })
            this.setAlert({ type: 'info', text: 'To continue using this service, you need to set your daily calorie and macronutrient goals.' })
          })
        }
      }).catch(error => {
        console.log(error.response)
        if (error.response.data.message === 'User data not found') {
          this.$router.push({ name: 'Onboarding' }).then(() => {
            this.setSnackbar({ color: 'error', text: error.response.data.message })
            this.setAlert({ type: 'info', text: 'To continue using this service, we need to collect data about you and prepare it for the formation and setting of goals for daily calories and macronutrients.' })
          })
        }
      })
    },
    loadUserFood() {
      this.get().then(response => {
        console.log(response)
        this.setDailyMacros(this.getUserFood)
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      })
    }
  },
  watch: {
    date(value, prev) {
      this.clearDailyMacros()
      this.dateFormatted = this.formatDate(value)
      this.selectedDate(value)
      if (prev) this.setDailyMacros(this.getUserFood)
    },
    foodSearchDialog(value) {
      if (!value) {
        this.clearFoundFood()
        this.clearLinks()
      }
    },
    foodItemDialog(value) {
      if (!value) this.selectedFood = this.selectedNutrients = null
    }
  },
  filters: {
    moment(date) {
      return moment(date).format('ddd MMM D');
    },
    zeroFixed(number) {
      return number > 0 ? number.toFixed(0) : 0
    }
  },
}
</script>