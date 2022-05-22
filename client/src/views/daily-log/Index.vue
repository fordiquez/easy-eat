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
            <v-btn v-model="fab" color="blue darken-2" dark fab>
              <v-icon v-if="fab">mdi-close</v-icon>
              <v-icon v-else>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-btn fab dark small color="green">
            <v-icon>mdi-hamburger-plus</v-icon>
          </v-btn>
          <v-btn fab dark small color="indigo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn fab dark small color="red">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <meal-time-list :user-food="getUserFood" :date="date" :meal-time="'Breakfast'" @food-search="onFoodSearchDialog" />
      </v-col>
      <v-col cols="12">
        <meal-time-list :user-food="getUserFood" :date="date" :meal-time="'Lunch'" @food-search="onFoodSearchDialog" />
      </v-col>
      <v-col cols="12">
        <meal-time-list :user-food="getUserFood" :date="date" :meal-time="'Dinner'" @food-search="onFoodSearchDialog" />
      </v-col>
      <v-col cols="12">
        <meal-time-list :user-food="getUserFood" :date="date" :meal-time="'Snack'" @food-search="onFoodSearchDialog" />
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

  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import moment from "moment"
import MealTimeList from "@/components/MealTimeList";
import FoodItem from "@/components/dialogs/FoodItem";
import FoodSearchDialog from "@/components/dialogs/FoodSearch";

export default {
  name: 'DailyLog',
  components: { FoodSearchDialog, FoodItem, MealTimeList },
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
    image: process.env.VUE_APP_STATIC_IMAGE_PATH,
    selectedFood: null,
    selectedNutrients: {
      CALS: null,
      CARBS: null,
      PROTEIN: null,
      FAT: null
    }
  }),
  created() {
    this.date = moment().format('yyyy-MM-DD')
    this.dateFormatted = this.computedDateFormatted
    this.get().then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error.response)
    })
  },
  computed: {
    ...mapGetters('food', ["getFoundFood", "getUserFood"]),
    greetingsTitle() {
      return this.user ? `Good ${this.timeOfDay(moment().hours())}, ` + this.user.firstName + '!' : null
    },
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
  },
  methods: {
    ...mapActions('food', ['search', 'add', 'get', 'selectedDate', 'selectedMealTime']),
    formatDate(date) {
      date ? [this.year, this.month, this.day] = date.split('-') : null
      return `${this.day}/${this.month}/${this.year}`
    },
    parseDate(date) {
      date ? [this.month, this.day, this.year] = date.split('/') : null
      return `${this.year}-${this.month.padStart(2, '0')}-${this.day.padStart(2, '0')}`
    },
    changeDay(duration) {
      this.date = moment(this.date).add(duration, 'days').format('yyyy-MM-DD')
    },
    timeOfDay(hours) {
      return hours >= 0 && hours < 6 ? 'night' : hours >= 6 && hours < 12 ? 'morning' : hours >= 12 && hours < 18 ? 'day' : 'evening'
    },
    onFoodSearchDialog(mealTime) {
      console.log(mealTime)
      this.selectedMealTime(mealTime)
      this.foodSearchDialog = true
    },
    onFoodItemDialog(foodItem) {
      console.log(foodItem)
      this.foodItemDialog = true
      this.selectedFood = foodItem.food
      const nutrients = {
        CALS: foodItem.food.nutrients.ENERC_KCAL || null,
        CARBS: foodItem.food.nutrients.CHOCDF || null,
        PROTEIN: foodItem.food.nutrients.PROCNT || null,
        FAT: foodItem.food.nutrients.FAT || null
      }
      this.selectedNutrients = Object.assign({}, nutrients)
      console.log(this.selectedFood)
      console.log(this.selectedNutrients)
    }
  },
  watch: {
    date(value) {
      this.dateFormatted = this.formatDate(value)
      this.selectedDate(value)
    },
    foodItemDialog(value) {
      !value ? this.selectedFood = this.selectedNutrients = null : null
    }
  },
  filters: {
    moment(date) {
      return moment(date).format('ddd MMM D');
    },
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  },
}
</script>

<style>
.input-number input {
  text-align: center;
}
</style>
