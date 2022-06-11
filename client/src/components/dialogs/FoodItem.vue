<template>
  <v-dialog v-if="selectedFood" v-model="dialog" :fullscreen="$vuetify.breakpoint.xsOnly" @input="onClose" max-width="550">
    <v-card class="mx-auto" rounded>
      <v-toolbar color="success" dense>
        <v-toolbar-title>{{ selectedFood.label }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="ml-5" @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-row class="mx-auto my-auto">
        <v-col cols="12" class="d-flex justify-start" :class="$vuetify.breakpoint.xsOnly ? 'flex-column' : ''">
          <v-img ref="image" :src="selectedFood.image || image" :lazy-src="selectedFood.image || image" class="rounded-circle" :class="$vuetify.breakpoint.xsOnly ? 'align-self-center' : ''" max-width="185" max-height="185" />
          <v-flex class="flex-column" :class="$vuetify.breakpoint.smAndUp ? 'ml-5' : ''">
            <v-card-title class="px-0 py-2">{{ selectedFood.label }}</v-card-title>
            <v-card-subtitle class="px-0 pt-2 pb-0 text-subtitle-1">{{ selectedFood.category }}</v-card-subtitle>
            <v-card-text class="px-0 py-2 text-subtitle-2">{{ servings }} {{ servings > 1 ? measure + 's' : measure }}</v-card-text>
          </v-flex>
        </v-col>
        <v-col class="pt-0">
          <v-chip-group v-if="selectedFood.healthLabels" class="chip-labels" column>
            <v-chip v-for="label in selectedFood.healthLabels" outlined text-color="success" :key="label">{{ label }}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-divider class="mx-4" />

      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-flex class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="red">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Net Carbs</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text" v-if="itemAdding">
                  {{ carbsSign === 'left' ? carbsLeft : carbsOver }}g {{ carbsSign }}
                </label>
                <label class="red--text font-weight-bold">{{ selectedNutrients.CARBS | fixed }}g</label>
              </v-card-text>
            </v-flex>
            <v-progress-linear :value="dailyPercentageCarbs" color="red" class="my-2" rounded />

            <v-flex class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="light-blue">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Protein</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text" v-if="itemAdding">
                  {{ proteinSign === 'left' ? proteinLeft : proteinOver }}g {{ proteinSign }}
                </label>
                <label class="light-blue--text font-weight-bold">{{ selectedNutrients.PROTEIN | fixed }}g</label>
              </v-card-text>
            </v-flex>
            <v-progress-linear :value="dailyPercentageProtein" color="light-blue" class="my-2" rounded />

            <v-flex class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="orange">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Fat</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text" v-if="itemAdding">
                  {{ fatSign === 'left' ? fatLeft : fatOver }}g {{ fatSign }}
                </label>
                <label class="orange--text font-weight-bold">{{ selectedNutrients.FAT | fixed }}g</label>
              </v-card-text>
            </v-flex>
            <v-progress-linear :value="dailyPercentageFat" color="orange" class="my-2" rounded />

            <v-flex class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="teal">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Calories</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text" v-if="itemAdding">
                  {{ calsSign === 'left' ? calsLeft : calsOver }} {{ calsSign }}
                </label>
                <label class="teal--text font-weight-bold">{{ selectedNutrients.CALS | fixed }}</label>
              </v-card-text>
            </v-flex>
            <v-progress-linear :value="dailyPercentageCals" color="teal" class="my-2" rounded />

          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-select
                prepend-inner-icon="mdi-food"
                color="success"
                item-color="success"
                label="Serving size"
                v-model="measure"
                :items="measures"
                @change="setNutrients"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model.number="servings"
                class="input-number"
                type="number"
                color="success"
                label="Servings"
                :suffix="suffix"
                @input="setServings"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon color="success" :disabled="disabled" :style="{ cursor: cursorType, pointerEvents: 'auto' }" @click="decrement">
                  <v-icon>mdi-numeric-negative-1</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-btn icon color="success" @click="increment">
                  <v-icon>mdi-numeric-positive-1</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-slide-group v-model="mealTime" mandatory show-arrows center-active>
              <v-slide-item v-for="mealTime in getMealTimes.labels" :key="mealTime" v-slot="{ active, toggle }">
                <v-btn class="mx-2" active-class="success" :input-value="active" depressed rounded @click="toggle">{{ mealTime }}</v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-col>

          <v-col cols="12" v-if="!itemAdding">
            <v-btn color="red" text block :loading="loading" @click="onRemove">
              <v-icon class="mr-1">mdi-hamburger-remove</v-icon>
              <span>Remove from food log</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="mx-4" />
      <v-card-actions>
        <v-btn text large color="success" @click="onClose">Cancel</v-btn>
        <v-spacer />
        <v-btn text large color="success" :loading="loading" v-if="itemAdding" @click="onAddFood" :disabled="disabled">
          <v-icon class="mr-1">mdi-hamburger-plus</v-icon>
          <span>Add to food log</span>
        </v-btn>
        <v-btn text large color="success" :loading="loading" v-else @click="onEditFood" :disabled="disabled">Save changes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "FoodItemDialog",
  props: {
    foodItemDialog: {
      type: Boolean,
      default: false
    },
    selectedFood: {
      type: Object,
      default: null
    },
    selectedNutrients: {
      type: Object,
      default: null
    },
    itemAdding: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    image: process.env.VUE_APP_STATIC_IMAGE_PATH,
    servings: null,
    mealTime: '',
    measure: 'gram',
    measures: ['gram', 'kilogram', 'milliliter', 'liter'],
    coefficient: null,
    dialog: false,
    loading: false
  }),
  created() {
    this.dialog = this.foodItemDialog
    !this.itemAdding ? this.servings = this.selectedFood.servings : this.servings = 100
    !this.itemAdding ? this.measure = this.selectedFood.measure : this.measure = 'gram'
    this.measure === 'gram' || this.measure === 'milliliter' ? this.coefficient = 1 : this.coefficient = 1000
    this.mealTime = this.getMealTimes.labels.findIndex(item => item === this.getMealTime || item === this.selectedFood.mealTime)
    if (this.itemAdding && this.selectedFood.foodContentsLabel && !Array.isArray(this.selectedFood.foodContentsLabel)) {
      const foodLabels = this.selectedFood.foodContentsLabel.toLowerCase().split(';')
      this.selectedFood.healthLabels = foodLabels.filter((v, i, a) => a.indexOf(v) === i)
      delete this.selectedFood.foodContentsLabel
    }
  },
  computed: {
    ...mapGetters('account', ['getUserValue']),
    ...mapGetters('userData', ['getUserDataValue']),
    ...mapGetters('food', ['getDate', 'getMealTime', 'getMealTimes', 'getDailyMacros', 'getUserFood']),
    cursorType() {
      return this.servings <= 0 ? 'not-allowed' : 'pointer'
    },
    disabled() {
      return this.loading || this.servings < 1
    },
    suffix() {
      return this.measure === 'gram' ? 'g' : this.measure === 'kilogram' ? 'kg' : this.measure === 'liter' ? 'l' : 'ml'
    },
    foodMealTime() {
      return this.getMealTimes.labels[this.mealTime]
    },
    dailyPercentageCarbs() {
      return this.selectedNutrients.CARBS * 100 / this.getUserDataValue?.macros.CARBS
    },
    dailyPercentageProtein() {
      return this.selectedNutrients.PROTEIN * 100 / this.getUserDataValue?.macros.PROTEIN
    },
    dailyPercentageFat() {
      return this.selectedNutrients.FAT * 100 / this.getUserDataValue?.macros.FAT
    },
    dailyPercentageCals() {
      return this.selectedNutrients.CALS * 100 / this.getUserDataValue?.TDEE
    },
    carbsLeft() {
      return this.parsedNumber(this.getUserDataValue?.macros.CARBS - this.getDailyMacros.CARBS - this.selectedNutrients.CARBS)
    },
    carbsOver() {
      return this.parsedNumber(this.carbsLeft - this.carbsLeft * 2)
    },
    carbsSign() {
      return this.carbsOver > this.carbsLeft ? 'over' : 'left'
    },
    proteinLeft() {
      return this.parsedNumber(this.getUserDataValue?.macros.PROTEIN - this.getDailyMacros.PROTEIN - this.selectedNutrients.PROTEIN)
    },
    proteinOver() {
      return this.parsedNumber(this.proteinLeft - this.proteinLeft * 2)
    },
    proteinSign() {
      return this.proteinOver > this.proteinLeft ? 'over' : 'left'
    },
    fatLeft() {
      return this.parsedNumber(this.getUserDataValue?.macros.FAT - this.getDailyMacros.FAT - this.selectedNutrients.FAT)
    },
    fatOver() {
      return this.parsedNumber(this.fatLeft - this.fatLeft * 2)
    },
    fatSign() {
      return this.fatOver > this.fatLeft ? 'over' : 'left'
    },
    calsLeft() {
      return this.parsedNumber(this.getUserDataValue?.TDEE - this.getDailyMacros.CALS - this.selectedNutrients.CALS)
    },
    calsOver() {
      return this.parsedNumber(this.calsLeft - this.calsLeft * 2)
    },
    calsSign() {
      return this.calsOver > this.calsLeft ? 'over' : 'left'
    }
  },
  methods: {
    ...mapActions('food', ['add', 'update', 'delete', 'selectedMealTime', 'updateDailyMacros']),
    ...mapActions('notification', ['setSnackbar']),
    increment() {
      this.servings = parseInt(this.servings,10) + 1
      this.setServings()
    },
    decrement() {
      this.servings = parseInt(this.servings,10) - 1
      this.setServings()
    },
    onAddFood() {
      this.loading = true
      const { id } = this.getUserValue
      const { label, category, healthLabels, image } = this.selectedFood
      const [nutrients, date, mealTime, measure, servings] = [this.selectedNutrients, this.getDate, this.foodMealTime, this.measure, this.servings]
      const payload = {
        accountId: id,
        date,
        mealTime,
        measure,
        servings,
        label,
        category,
        healthLabels,
        image,
        nutrients
      }
      this.add(payload).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.onClose())
    },
    onEditFood() {
      this.loading = true
      const foodItem = this.selectedFood
      foodItem.nutrients = this.selectedNutrients
      foodItem.servings = this.servings
      foodItem.measure = this.measure
      foodItem.mealTime = this.getMealTimes.labels[this.mealTime]
      this.update(foodItem).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.onClose())
    },
    onRemove() {
      this.loading = true
      this.delete(this.selectedFood).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.onClose())
    },
    onClose() {
      this.loading = false
      this.selectedMealTime('')
      this.$emit('close-dialog')
    },
    oneUnits() {
      const oneUnits = {}
      if (this.itemAdding) {
        oneUnits.CALS = this.selectedFood.nutrients.ENERC_KCAL / 100
        oneUnits.CARBS = this.selectedFood.nutrients.CHOCDF / 100
        oneUnits.PROTEIN = this.selectedFood.nutrients.PROCNT / 100
        oneUnits.FAT = this.selectedFood.nutrients.FAT / 100
      } else {
        oneUnits.CALS = this.selectedFood.nutrients.CALS / this.selectedFood.servings / this.coefficient
        oneUnits.CARBS = this.selectedFood.nutrients.CARBS / this.selectedFood.servings / this.coefficient
        oneUnits.PROTEIN = this.selectedFood.nutrients.PROTEIN / this.selectedFood.servings / this.coefficient
        oneUnits.FAT = this.selectedFood.nutrients.FAT / this.selectedFood.servings / this.coefficient
      }
      return oneUnits
    },
    setNutrients(measure) {
      const oneUnits = this.oneUnits()
      if (measure === 'gram' || measure === 'milliliter') {
        this.selectedNutrients.CALS = oneUnits.CALS * this.servings
        this.selectedNutrients.CARBS = oneUnits.CARBS * this.servings
        this.selectedNutrients.PROTEIN = oneUnits.PROTEIN * this.servings
        this.selectedNutrients.FAT = oneUnits.FAT * this.servings
      } else if (measure === 'kilogram' || measure === 'liter') {
        this.selectedNutrients.CALS = oneUnits.CALS * this.servings * 1000
        this.selectedNutrients.CARBS = oneUnits.CARBS * this.servings * 1000
        this.selectedNutrients.PROTEIN = oneUnits.PROTEIN * this.servings * 1000
        this.selectedNutrients.FAT = oneUnits.FAT * this.servings * 1000
      }
    },
    setServings() {
      if (this.servings >= 0) this.setNutrients(this.measure)
    },
    parsedNumber(formula) {
      return Number.parseInt((formula).toFixed(0))
    }
  },
  watch: {
    servings(value) {
      if (value < 0 || !value) this.servings = 0
    }
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  }
}
</script>
<style>
.chip-labels > .v-slide-group__content {
  justify-content: start;
}
</style>