<template>
  <v-dialog v-model="dialog" @input="onClose" scrollable max-width="800">
    <v-card>
      <v-card-title>
        <v-row class="d-flex flex-sm-row-reverse align-center">
          <v-col cols="1" class="ml-sm-auto">
            <v-btn icon color="red" @click="onClose">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="ml-sm-auto">
            <v-select v-model="mealTime" color="success" item-color="success" :items="getMealTimes.labels" :prepend-inner-icon="mealTimeIcon" rounded>
              <template v-slot:item="{ item }">
                <v-icon class="mr-1">{{ getMealTimes.icons[getMealTimes.labels.indexOf(item)] }}</v-icon>
                <label>{{ item }}</label>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-title>
      <v-toolbar>
        <v-text-field
            color="success"
            v-model="ingr"
            label="Search foods and meals..."
            placeholder="Search foods and meals..."
            full-width
            :loading="loading"
        />
        <v-tooltip left color="success">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="success" v-on="on" @bind="attrs" @click="searchFiltersDialog = true">
              <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
          </template>
          <span>Search Filters</span>
        </v-tooltip>
        <v-btn text color="success" class="ml-3" @click="onFoodSearch" :disabled="loading" :loading="loading">
          <v-icon class="mr-1">mdi-magnify</v-icon>
          <span>Find</span>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card-text v-if="getCurrentPageFood.length" :class="$vuetify.breakpoint.smAndDown ? 'px-0' : ''">
        <v-list max-height="500">
          <v-list-item-group v-model="selection" color="success">
            <v-list-item v-for="item in getCurrentPageFood" :key="item.food.foodId" @click="onFoodItemDialog(item)">
              <v-row class="d-flex flex-column flex-sm-row">
                <v-col cols="12" sm="4" md="6" class="d-flex">
                  <v-list-item-avatar width="70" height="70">
                    <v-img :src="item.food.image || image" :lazy-src="item.food.image || image" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6" style="white-space: break-spaces">{{ item.food.label }}</v-list-item-title>
                    <v-list-item-subtitle class="hidden-sm-and-down">{{ item.food.category }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
                <v-col cols="12" sm="8" md="6" class="d-sm-flex pa-0 hidden-xs-only">
                  <v-list-item-content class="d-flex flex-column align-center">
                    <v-list-item-title class="text-subtitle-1">Net Carbs</v-list-item-title>
                    <v-list-item-subtitle class="red--text darken-3 font-weight-bold">{{ item.food.nutrients.CHOCDF | fixed }}g</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content class="d-flex flex-column align-center">
                    <v-list-item-title class="text-subtitle-1">Protein</v-list-item-title>
                    <v-list-item-subtitle class="blue--text darken-3 font-weight-bold">{{ item.food.nutrients.PROCNT | fixed }}g</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content class="d-flex flex-column align-center">
                    <v-list-item-title class="text-subtitle-1">Fat</v-list-item-title>
                    <v-list-item-subtitle class="orange--text darken-3 font-weight-bold">{{ item.food.nutrients.FAT | fixed }}g</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content class="d-flex flex-column align-center">
                    <v-list-item-title class="text-subtitle-1">Cals</v-list-item-title>
                    <v-list-item-subtitle class="teal--text darken-3 font-weight-bold">{{ item.food.nutrients.ENERC_KCAL | fixed }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions v-if="getCurrentPageFood.length" class="justify-space-between">
        <span class="text-subtitle-2">Showing {{ firstFoodItem }}-{{ lastFoodItem }} of {{ getFoundFood.length }} queries</span>
        <v-pagination v-model="currentPage" color="success" :length="getLinks.length" :total-visible="6" @input="updateCurrentPage" />
        <v-btn text large color="success" class="ml-3" :disabled="loading" :loading="loading" @click="onNextPage">
          <v-icon class="mr-2">mdi-magnify-plus</v-icon>
          <span>Load more</span>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="searchFiltersDialog" max-width="600">
      <v-card>
        <div class="d-flex justify-end pr-2 pt-2">
        </div>
        <v-card-title class="text-h5 d-flex">
          <v-spacer/>
          <span>Search filters</span>
          <v-spacer/>
          <v-btn icon color="red" @click="searchFiltersDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-row class="mx-0 my-0">
          <v-col>
            <v-card-text class="text-subtitle-2 white--text pt-0">Select the nutrition type between cooking and food logging processor</v-card-text>
            <v-slide-group v-model="nutritionType" show-arrows mandatory>
              <v-slide-item v-for="nutrition in nutritionTypes" :key="nutrition" v-slot="{ active, toggle }">
                <v-btn class="mx-2" active-class="success" :input-value="active" depressed rounded @click="toggle">{{ nutrition }}</v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-col>
          <v-col>
            <v-card-text class="text-subtitle-2 white--text pt-0">Select the category</v-card-text>
            <v-slide-group v-model="categories" show-arrows multiple>
              <v-slide-item v-for="category in getCategories" :key="category.value" v-slot="{ active, toggle }">
                <v-tooltip top color="success" max-width="500" close-delay="200" open-on-click>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" active-class="success" v-on="on" @bind="attrs" :input-value="active" depressed rounded @click="toggle">{{ category.title }}</v-btn>
                  </template>
                  <span>{{ category.description }}</span>
                </v-tooltip>
              </v-slide-item>
            </v-slide-group>
          </v-col>
          <v-col cols="12">
            <v-card-text class="text-subtitle-2 white--text pt-0">Select the health labels</v-card-text>
            <v-autocomplete
                v-model="healthLabels" :items="getHealthLabels"
                color="success" item-color="success" label="Select options" item-text="title" item-value="value"
                filled chips multiple clearable hide-details single-line
            >
              <template v-slot:selection="data">
                <v-tooltip top max-width="500" color="success" close-delay="200" open-delay="200">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip color="success" v-on="on" @bind="data.attrs && attrs" :input-value="data.selected" @click="data.select" @click:close="remove(data.item)" close>
                      {{ data.item.title }}
                    </v-chip>
                  </template>
                  <span>{{ data.item.description }}</span>
                </v-tooltip>
              </template>
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item-content v-text="data.item" />
                </template>
                <template v-else>
                  <v-list-item-content style="max-width: 525px">
                    <v-list-item-title v-text="data.item.title" />
                    <v-list-item-subtitle v-text="data.item.description" style="white-space: break-spaces" />
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col>
            <v-card-text class="text-subtitle-2 white--text pt-0">Calories range</v-card-text>
            <v-range-slider v-model="caloriesRange" :max="caloriesMax" :min="caloriesMin" hide-details thumb-label color="success" track-fill-color="success" class="align-center">
              <template v-slot:prepend>
                <v-text-field
                    v-model.number="caloriesRange[0]"
                    class="input-number mt-0 pt-0"
                    type="number"
                    style="width: 120px"
                    color="success"
                    label="Min value"
                    placeholder="Min value"
                    suffix="cals"
                    @change="$set(caloriesRange, 0, $event)"
                    hide-spin-buttons
                    hide-details
                    single-line
                />
              </template>
              <template v-slot:append>
                <v-text-field
                    v-model.number="caloriesRange[1]"
                    class="input-number mt-0 pt-0"
                    type="number"
                    style="width: 120px"
                    color="success"
                    label="Max value"
                    placeholder="Max value"
                    suffix="cals"
                    @change="$set(caloriesRange, 1, $event)"
                    hide-spin-buttons
                    hide-details
                    single-line
                />
              </template>

            </v-range-slider>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
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
    dialog: false,
    searchFiltersDialog: false,
    loading: false,
    mealTime: null,
    selection: null,
    nutritionType: 0,
    nutritionTypes: ['cooking', 'logging'],
    categories: [],
    ingr: '',
    currentPage: 1,
    healthLabels: [],
    caloriesMin: 0,
    caloriesMax: 1000,
    caloriesRange: [0, 1000]
  }),
  created() {
    this.dialog = this.foodSearchDialog
    this.mealTime = this.getMealTime
  },
  computed: {
    ...mapGetters('food', [
        'getFoundFood', 'getCurrentPageFood','getHealthLabels', 'getCategories', 'getMealTime', 'getMealTimes', 'getLinks'
    ]),
    image() {
      return process.env.VUE_APP_STATIC_IMAGE_PATH
    },
    mealTimeIcon() {
      return this.getMealTimes.icons[this.getMealTimes.labels.indexOf(this.mealTime)]
    },
    nextPageUrl() {
      return this.getLinks[this.getLinks.length - 1]
    },
    firstFoodItem() {
      return this.getFoundFood.findIndex(item => item.food.foodId === this.getCurrentPageFood[0].food.foodId) + 1
    },
    lastFoodItem() {
      return this.getFoundFood.findIndex(item => item.food.foodId === this.getCurrentPageFood[this.getCurrentPageFood.length - 1].food.foodId) + 1
    }
  },
  methods: {
    ...mapActions('food', ['searchParser', 'searchNextPage', 'selectedMealTime', 'setCurrentPage']),
    onFoodSearch() {
      if (this.ingr.length >= 3) {
        const params = {}
        params.ingr = this.ingr
        params['nutrition-type'] = this.nutritionTypes[this.nutritionType]
        if (this.categories.length) params.category = this.categories.map(index => this.getCategories[index].value)
        if (this.healthLabels.length) params.healthLabels = this.healthLabels
        if (this.caloriesRange[0] !== 0 || this.caloriesRange[1] !== 1000) params.calories = `${this.caloriesRange[0]}-${this.caloriesRange[1]}`
        this.loading = true
        console.log(params)
        this.searchParser(params).catch(error => {
          console.log(error.response)
        }).finally(() => this.loading = false)
      }
    },
    onFoodItemDialog(foodItem) {
      this.selectedMealTime(this.mealTime)
      this.$emit('food-item', foodItem)
    },
    onClose() {
      this.$emit('close-dialog')
      this.selection = null
    },
    updateCurrentPage(value) {
      this.currentPage = value
      this.setCurrentPage(value)
    },
    onNextPage() {
      this.loading = true
      this.searchNextPage(this.nextPageUrl).then(() => {
        this.updateCurrentPage(this.getLinks.length)
      }).catch(error => {
        console.log(error.response)
      }).finally(() => this.loading = false)
    },
    remove(item) {
      const index = this.healthLabels.indexOf(item.value)
      if (index >= 0) this.healthLabels.splice(index, 1)
    },
    increment() {
      console.log(this.caloriesRange[0])
      this.caloriesRange[0] += 1
    },
    decrement() {
      this.caloriesRange[0] -= 1
    }
  },
  watch: {
    mealTime(value) {
      this.selectedMealTime(value)
    },
    foodItemDialog(value) {
      if (!value) this.selection = null
    }
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  }
}
</script>