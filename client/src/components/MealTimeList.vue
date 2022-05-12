<template>
  <div>
    <v-card elevation="5" outlined shaped>
      <v-card-title>
        <v-icon class="mr-1">{{ getMealTimes.icons[getMealTimes.labels.indexOf(mealTime)] }}</v-icon>
        <span>{{ mealTime }}</span>
      </v-card-title>
      <v-btn color="success" block text rounded elevation="5" @click="onFoodSearchDialog">
        <v-icon class="mr-1">mdi-hamburger-plus</v-icon>
        <span>Add {{ mealTime }}</span>
      </v-btn>
      <v-list v-if="mealTimeItems.length">
        <v-list-item-group v-model="selection" color="success">
          <v-list-item v-for="item in mealTimeItems" :key="item.id" @click="onSelectedFoodItem(item)">
            <v-row class="d-flex flex-column flex-sm-row">
              <v-col cols="12" sm="4" md="6" class="d-flex">
                <v-list-item-avatar width="70" height="70">
                  <v-img :src="item.image || image" :lazy-src="item.image || image" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">{{ item.label }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.category }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ item.servings }} {{ item.servings > 1 ? item.measure + 's' : item.measure }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col cols="12" sm="8" md="6" class="d-sm-flex hidden-xs-only">
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Net Carbs</v-list-item-title>
                  <v-list-item-subtitle>{{ item.nutrients.CARBS | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Protein</v-list-item-title>
                  <v-list-item-subtitle>{{ item.nutrients.PROTEIN | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Fat</v-list-item-title>
                  <v-list-item-subtitle>{{ item.nutrients.FAT | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Cals</v-list-item-title>
                  <v-list-item-subtitle>{{ item.nutrients.CALS | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list-item-group>
        <v-list-item v-if="mealTimeItems.length" class="hidden-xs-only">
          <v-row class="d-flex flex-column flex-sm-row">
            <v-col cols="12" sm="4" md="6" xs="2" class="d-flex">
              <v-list-item-title class="text-h6">{{ mealTime }} Total</v-list-item-title>
            </v-col>
            <v-col cols="12" sm="8" md="6" xs="2" class="d-flex">
              <v-list-item-content class="d-flex flex-column align-center">
                <v-list-item-title class="text-subtitle-1">Net Carbs</v-list-item-title>
                <v-list-item-subtitle>{{ mealTotals.CARBS | fixed }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="d-flex flex-column align-center">
                <v-list-item-title class="text-subtitle-1">Protein</v-list-item-title>
                <v-list-item-subtitle>{{ mealTotals.PROTEIN | fixed }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="d-flex flex-column align-center">
                <v-list-item-title class="text-subtitle-1">Fat</v-list-item-title>
                <v-list-item-subtitle>{{ mealTotals.FAT | fixed }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content class="d-flex flex-column align-center">
                <v-list-item-title class="text-subtitle-1">Cals</v-list-item-title>
                <v-list-item-subtitle>{{ mealTotals.CALS | fixed }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-col>

          </v-row>
        </v-list-item>
      </v-list>
    </v-card>

    <food-item v-if="foodItemDialog"
               :food-item-dialog="foodItemDialog"
               :selected-food="selectedFood"
               :selected-nutrients="selectedNutrients"
               :item-adding="false"
               @close-dialog="foodItemDialog = false"
    />
  </div>
</template>

<script>
import FoodItem from "@/components/dialogs/FoodItem";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "MealTimeList",
  components: { FoodItem },
  props: {
    userFood: {
      type: Array,
      default: null
    },
    mealTime: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      default: null
    }
  },
  data: () => ({
    image: process.env.VUE_APP_STATIC_IMAGE_PATH,
    selection: null,
    mealTotals: {
      CALS: null,
      CARBS: null,
      PROTEIN: null,
      FAT: null
    },
    foodItemDialog: false,
    selectedFood: null,
    selectedNutrients: null
  }),
  beforeUpdate() {
    this.mealTotals.CALS = this.mealTotals.CARBS = this.mealTotals.PROTEIN = this.mealTotals.FAT = null
    this.mealTimeItems.forEach(item => {
      this.mealTotals.CALS += item.nutrients.CALS
      this.mealTotals.CARBS += item.nutrients.CARBS
      this.mealTotals.PROTEIN += item.nutrients.PROTEIN
      this.mealTotals.FAT += item.nutrients.FAT
    })
  },
  computed: {
    ...mapGetters('food', ['getDate', 'getMealTimes']),
    mealTimeItems() {
      return this.userFood.filter(item => item.mealTime === this.mealTime)
    },
  },
  methods: {
    ...mapActions('food', ['selectedMealTime']),
    onFoodSearchDialog() {
      this.$emit('food-search', this.mealTime)
    },
    onSelectedFoodItem(foodItem) {
      this.selectedMealTime(this.mealTime)
      this.foodItemDialog = true
      this.selectedFood = foodItem
      const nutrients = {
        CALS: foodItem.nutrients.CALS || null,
        CARBS: foodItem.nutrients.CARBS || null,
        PROTEIN: foodItem.nutrients.PROTEIN || null,
        FAT: foodItem.nutrients.FAT || null
      }
      this.selectedNutrients = Object.assign({}, nutrients)
    }
  },
  watch: {
    foodItemDialog(value) {
      !value ? this.selection = this.selectedFood = this.selectedNutrients = null : null
    }
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  }
}
</script>
