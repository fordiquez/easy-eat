<template>
  <v-dialog v-model="foodSearchDialog" @click:outside="onClose" scrollable max-width="800">
    <v-card>
      <v-card-title>
        <v-row justify="center">
          <v-col class="ml-auto pa-0" cols="11" md="4">
            <v-select
                color="success"
                item-color="success"
                :prepend-inner-icon="getMealTimes.icons[getMealTimes.labels.indexOf(mealTime)]"
                v-model="mealTime"
                :items="getMealTimes.labels" rounded>
              <template v-slot:item="{ item }">
                <v-icon class="mr-1">{{ getMealTimes.icons[getMealTimes.labels.indexOf(item)] }}</v-icon>
                <label>{{ item }}</label>
              </template>
            </v-select>
          </v-col>
          <v-col class="ml-auto" cols="1">
            <v-btn icon color="red" class="ml-5" @click="onClose">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-toolbar>
        <v-text-field
            color="success"
            append-icon="mdi-magnify"
            v-model="query"
            label="Search foods and servings..."
            placeholder="Search foods and servings..."
            full-width
            :loading="loading"
        />
        <v-btn text height="100%" color="success" class="ml-3" @click="onFoodSearch" :disabled="loading" :loading="loading">Find</v-btn>
      </v-toolbar>
      <v-divider/>
      <v-card-text>
        <v-list max-height="500">
          <v-list-item-group v-model="selection" color="success">
            <v-list-item v-for="item in getFoundFood" :key="item.food.foodId" @click="onFoodItemDialog(item)">
              <v-list-item-avatar width="70" height="70">
                <v-img :src="item.food.image || image" :lazy-src="item.food.image || image" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-h6">{{ item.food.label }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.food.category }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-col cols="6" class="d-flex">
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Net Carbs</v-list-item-title>
                  <v-list-item-subtitle>{{ item.food.nutrients.CHOCDF | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Protein</v-list-item-title>
                  <v-list-item-subtitle>{{ item.food.nutrients.PROCNT | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Fat</v-list-item-title>
                  <v-list-item-subtitle>{{ item.food.nutrients.FAT | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content class="d-flex flex-column align-center">
                  <v-list-item-title class="text-subtitle-1">Cals</v-list-item-title>
                  <v-list-item-subtitle>{{ item.food.nutrients.ENERC_KCAL | fixed }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "FoodSearchDialog",
  props: {
    foodSearchDialog: {
      type: Boolean,
      default: false
    },
    foodItemDialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    image: process.env.VUE_APP_STATIC_IMAGE_PATH,
    mealTime: '',
    query: null,
    loading: false,
    selection: null
  }),
  created() {
    this.mealTime = this.getMealTime
  },
  computed: {
    ...mapGetters('food', ['getFoundFood', 'getMealTime', 'getMealTimes', 'getTimes'])
  },
  methods: {
    ...mapActions('food', ['search', 'selectedMealTime']),
    onFoodSearch() {
      this.loading = true
      this.search(this.query).catch(error => {
        console.log(error.response)
      }).finally(() => this.loading = false)
    },
    onFoodItemDialog(foodItem) {
      console.log(foodItem)
      this.$emit('food-item', foodItem)
    },
    onClose() {
      this.$emit('close-dialog')
      this.selection = null
    },
  },
  watch: {
    mealTime(value) {
      this.selectedMealTime(value)
    },
    foodItemDialog(value) {
      !value ? this.selection = null : null
    }
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  }
}
</script>

<style scoped>

</style>