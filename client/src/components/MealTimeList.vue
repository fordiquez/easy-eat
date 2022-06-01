<template>
  <div>
    <v-card elevation="5" outlined shaped>
      <v-card-title class="pb-1">
        <v-icon class="mr-1">{{ mealTimeIcon }}</v-icon>
        <label>{{ mealTime }}</label>
      </v-card-title>
      <v-card-text class="pb-1">
        Recommended: {{ recommendedCals | zeroFixed }} cals —
        {{ calsSign === 'left' ? calsLeft : calsOver }} cals {{ calsSign }}
      </v-card-text>
      <v-divider v-if="mealTimeItems.length" />
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
        <v-divider v-if="mealTimeItems.length && $vuetify.breakpoint.smAndUp" />
        <v-list-item v-if="mealTimeItems.length && $vuetify.breakpoint.smAndUp">
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
      <v-divider />
      <v-btn color="success" block text rounded elevation="5" @click="onFoodSearchDialog">
        <v-icon class="mr-1">mdi-hamburger-plus</v-icon>
        <span>Add {{ mealTime }}</span>
      </v-btn>
    </v-card>

    <food-item
        v-if="foodItemDialog"
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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MealTimeList",
  components: { FoodItem },
  props: {
    mealTime: {
      type: String,
      default: null,
    },
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
    ...mapGetters('food', ['getUserFood', 'getDate', 'getMealTimes']),
    ...mapGetters('userData', ['getUserDataValue']),
    mealTimeItems() {
      return this.getUserFood.filter(item => item.mealTime === this.mealTime)
    },
    mealTimeIcon() {
      return this.getMealTimes.icons[this.getMealTimes.labels.indexOf(this.mealTime)]
    },
    recommendedCals() {
      return this.getUserDataValue?.TDEE ? this.mealTime !== 'Snack' ? this.getUserDataValue.TDEE * 30 / 100 : this.getUserDataValue.TDEE * 10 / 100 : 0
    },
    calsLeft() {
      return Number.parseInt((this.recommendedCals - this.mealTotals.CALS).toFixed(0))
    },
    calsOver() {
      return Number.parseInt((this.calsLeft - this.calsLeft * 2).toFixed(0))
    },
    calsSign() {
      return this.calsOver > this.calsLeft ? 'over' : 'left'
    }
  },
  methods: {
    ...mapActions('food', ['selectedMealTime', 'setSelectedNutrients', 'setDailyMacros', 'clearDailyMacros']),
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
      this.setSelectedNutrients(this.selectedNutrients)
    }
  },
  watch: {
    foodItemDialog(value) {
      if (!value) {
        this.selection = this.selectedFood = this.selectedNutrients = null
        this.setSelectedNutrients(this.selectedNutrients)
      }
    }
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    },
    zeroFixed(number) {
      return number > 0 ? number.toFixed(0) : 0
    }
  }
}
</script>
