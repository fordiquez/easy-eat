<template>
  <v-dialog v-if="selectedFood" v-model="foodItemDialog" @click:outside="onClose" max-width="550">
    <v-card class="mx-auto" rounded>
      <v-toolbar color="success" dense>
        <v-toolbar-title>{{ selectedFood.label }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="ml-5" @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-row class="mx-auto my-auto">
        <v-col cols="5" xs="4">
          <v-img :src="selectedFood.image || image" :lazy-src="selectedFood.image || image" class="rounded-circle" />
        </v-col>
        <v-col cols="7" xs="8">
          <v-card-title class="px-0 py-2">{{ selectedFood.label }}</v-card-title>
          <v-card-subtitle class="px-0 py-2 text-subtitle-1">{{ selectedFood.category }}</v-card-subtitle>
          <v-card-text class="px-0 py-0 text-subtitle-2">{{ servings }} {{ servings > 1 ? measure + 's' : measure }}</v-card-text>
        </v-col>
      </v-row>
      <v-divider class="mx-4"></v-divider>

      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <div class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="red">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Net Carbs</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text">22g left</label>
                <label class="font-weight-bold red--text">{{ selectedNutrients.CARBS | fixed }}g</label>
              </v-card-text>
            </div>
            <v-progress-linear v-model="selectedNutrients.CARBS" color="red" class="my-2" rounded />

            <div class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="blue">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Protein</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text">22g left</label>
                <label class="font-weight-bold blue--text">{{ selectedNutrients.PROTEIN | fixed }}g</label>
              </v-card-text>
            </div>
            <v-progress-linear v-model="selectedNutrients.PROTEIN" color="blue" class="my-2" rounded />

            <div class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="orange">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Fat</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text">22g left</label>
                <label class="font-weight-bold orange--text">{{ selectedNutrients.FAT | fixed }}g</label>
              </v-card-text>
            </div>
            <v-progress-linear v-model="selectedNutrients.FAT" color="orange" class="my-2" rounded />

            <div class="d-flex justify-space-between">
              <v-card-text class="pa-0">
                <v-icon class="mr-1" color="teal">mdi-nutrition</v-icon>
                <label class="text-subtitle-2">Calories</label>
              </v-card-text>
              <v-card-text class="pa-0" style="max-width: max-content">
                <label class="pa-0 mr-2 text-subtitle-2 font-italic grey--text">22g left</label>
                <label class="font-weight-bold teal--text">{{ selectedNutrients.CALS | fixed }}</label>
              </v-card-text>
            </div>
            <v-progress-linear disabled="true" v-model="selectedNutrients.CALS" color="teal" class="my-2" rounded />

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
                @change="setMeasure"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model.number="servings"
                class="input-number"
                type="number"
                color="success"
                label="Servings"
                append-outer-icon="mdi-plus"
                @click:append-outer="increment"
                @input="setServings"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon :disabled="servings <= 0" :style="{ cursor: cursorType, pointerEvents: 'auto' }" @click="decrement">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-slide-group v-model="mealTime" show-arrows>
              <v-slide-item v-for="mealTime in mealTimes.labels" :key="mealTime" v-slot="{ active, toggle }">
                <v-btn class="mx-2" active-class="success" :input-value="active" depressed rounded @click="toggle">
                  {{ mealTime }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-col>

          <v-col cols="12" v-if="!itemAdding">
            <v-btn color="red" text block @click="onRemove">Remove from food log</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <v-btn color="success" text @click="onClose">Close</v-btn>
        <v-spacer />
        <v-btn color="success" text v-if="itemAdding" @click="onAddFood">Add</v-btn>
        <v-btn color="success" text v-else @click="onEditFood">Save changes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

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
    coefficient: null
  }),
  created() {
    !this.itemAdding ? this.servings = this.selectedFood.servings : this.servings = 100
    !this.itemAdding ? this.measure = this.selectedFood.measure : this.measure = 'gram'
    this.measure === 'gram' || this.measure === 'milliliter' ? this.coefficient = 1 : this.coefficient = 1000
    this.mealTime = this.mealTimes.labels.findIndex(item => item === this.getMealTime || item === this.selectedFood.mealTime)
  },
  computed: {
    ...mapGetters({
      user: 'account/getUserValue',
      date: 'food/getDate',
      getMealTime: 'food/getMealTime',
      mealTimes: 'food/getMealTimes'
    }),
    cursorType() {
      return this.servings === 0 ? 'not-allowed' : 'pointer'
    }
  },
  methods: {
    ...mapActions('food', ['add', 'edit', 'delete', 'selectedMealTime']),
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
      const { id } = this.user
      const { foodId, label, category, categoryLabel, image } = this.selectedFood
      const [nutrients, date, mealTime, measure, servings] = [this.selectedNutrients, this.date, this.mealTimes.labels[this.mealTime], this.measure, this.servings]
      const payload = {
        userId: id,
        date,
        mealTime,
        measure,
        servings,
        foodId,
        label,
        category,
        categoryLabel,
        nutrients,
        image
      }
      console.log(payload)
      this.add(payload).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.onClose())
    },
    onEditFood() {
      const foodItem = this.selectedFood
      foodItem.nutrients = this.selectedNutrients
      foodItem.servings = this.servings
      foodItem.measure = this.measure
      foodItem.mealTime = this.mealTimes.labels[this.mealTime]
      this.edit(foodItem).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.onClose())
    },
    onRemove() {
      this.delete(this.selectedFood.id).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.onClose())
    },
    onClose() {
      this.selectedMealTime('')
      this.$emit('close-dialog')
    },
    oneUnits() {
      const oneUnits = {}
      if (this.itemAdding) {
        oneUnits.CAL = this.selectedFood.nutrients.ENERC_KCAL / 100
        oneUnits.CARB = this.selectedFood.nutrients.CHOCDF / 100
        oneUnits.PROTEIN = this.selectedFood.nutrients.PROCNT / 100
        oneUnits.FAT = this.selectedFood.nutrients.FAT / 100
      } else {
        oneUnits.CAL = this.selectedFood.nutrients.CALS / this.selectedFood.servings / this.coefficient
        oneUnits.CARB = this.selectedFood.nutrients.CARBS / this.selectedFood.servings / this.coefficient
        oneUnits.PROTEIN = this.selectedFood.nutrients.PROTEIN / this.selectedFood.servings / this.coefficient
        oneUnits.FAT = this.selectedFood.nutrients.FAT / this.selectedFood.servings / this.coefficient
      }
      return oneUnits
    },
    setMeasure(measure) {
      const oneUnits = this.oneUnits()
      if (measure === 'gram' || measure === 'milliliter') {
        this.selectedNutrients.CALS = oneUnits.CAL * this.servings
        this.selectedNutrients.CARBS = oneUnits.CARB * this.servings
        this.selectedNutrients.PROTEIN = oneUnits.PROTEIN * this.servings
        this.selectedNutrients.FAT = oneUnits.FAT * this.servings
      } else if (measure === 'kilogram' || measure === 'liter') {
        this.selectedNutrients.CALS = oneUnits.CAL * this.servings * 1000
        this.selectedNutrients.CARBS = oneUnits.CARB * this.servings * 1000
        this.selectedNutrients.PROTEIN = oneUnits.PROTEIN * this.servings * 1000
        this.selectedNutrients.FAT = oneUnits.FAT * this.servings * 1000
      }
    },
    setServings() {
      this.setMeasure(this.measure)
    }
  },
  watch: {
    servings(value) {
      value < 0 ? this.servings = 0 : null
    }
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  }
}
</script>
