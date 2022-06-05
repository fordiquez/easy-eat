<template>
  <v-dialog v-model="dialog" @input="onClose" scrollable max-width="600">
    <v-card class="mx-auto" rounded>
      <v-toolbar color="success" dense>
        <v-toolbar-title>Create Food</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="ml-5" @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="px-3" style="max-height: 600px">
        <v-card-title class="white--text pb-1">Food Details</v-card-title>
        <v-card-text class="pb-0">Create your own custom food. Add food details, including servings, nutritional information and meal time.</v-card-text>
        <v-row class="mx-auto">
          <v-col cols="12" class="pb-0">
            <v-text-field
                v-model="foodItem.label"
                :error-messages="foodLabelErrors"
                color="success"
                label="Food label"
                prepend-icon="mdi-label"
                @blur="$v.foodItem.label.$touch()"
                @input="$v.foodItem.label.$touch()"
            />
          </v-col>
          <v-col :cols="foodItem.image && !foodImageErrors.length ? '8' : '12'" class="pt-0">
            <v-text-field
                v-model="foodItem.image"
                :error-messages="foodImageErrors"
                color="success"
                label="Food image"
                placeholder="Input the food image link"
                prepend-icon="mdi-link-plus"
                @blur="$v.foodItem.image.$touch()"
                @input="$v.foodItem.image.$touch()"
            />
          </v-col>
          <v-col cols="4" class="d-flex justify-center" v-if="foodItem.image && !foodImageErrors.length">
            <v-btn outlined color="success" @click="previewImage = true">
              <v-icon class="mr-1">mdi-image-search</v-icon>
              <span>Preview</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-card-text class="text-subtitle-2 pt-0">Food category</v-card-text>
            <v-slide-group v-model="foodItem.category" show-arrows mandatory>
              <v-slide-item v-for="category in getCategories" :key="category.value" v-slot="{ active, toggle }">
                <v-btn class="mx-2" active-class="success" :input-value="active" depressed rounded @click="toggle">{{ category.title }}</v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
        <v-card-text class="text-subtitle-1 white--text">Servings</v-card-text>
        <v-row class="mx-auto">
          <v-col cols="12" sm="6">
            <v-select
                color="success"
                item-color="success"
                label="Serving size"
                v-model="foodItem.measure"
                :items="measures"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model.number="foodItem.servings"
                :error-messages="foodServingsErrors"
                class="input-number"
                type="number"
                color="success"
                label="Servings"
                :suffix="suffix"
                @blur="$v.foodItem.servings.$touch()"
                @input="$v.foodItem.servings.$touch()"
                @change="foodItem.servings <= 0 ? foodItem.servings = 0 : null"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon color="success"
                       :disabled="foodItem.servings <= 0"
                       :style="{ cursor: foodItem.servings <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-btn icon color="success" @click="increment">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-card-text class="text-subtitle-1 white--text">Nutrients</v-card-text>
        <v-row>
          <v-col cols="1" class="d-flex justify-center align-center pl-5">
            <v-icon color="teal">mdi-nutrition</v-icon>
          </v-col>
          <v-col cols="11" class="pl-0">
            <v-text-field
                v-model.number="foodItem.nutrients.CALS"
                :error-messages="foodNutrientsCALSErrors"
                class="input-number"
                type="number"
                color="success"
                label="Calories"
                suffix="cals"
                @blur="$v.foodItem.nutrients.CALS.$touch()"
                @input="$v.foodItem.nutrients.CALS.$touch()"
                @change="foodItem.nutrients.CALS <= 0 ? foodItem.nutrients.CALS = 0 : null"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon color="success" :disabled="foodItem.nutrients.CALS <= 0"
                       :style="{ cursor: foodItem.nutrients.CALS <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement('CALS')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-btn icon color="success" @click="increment('CALS')">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="1" class="d-flex justify-center align-center pl-5">
            <v-icon color="red darken-1">mdi-nutrition</v-icon>
          </v-col>
          <v-col cols="11" class="pl-0">
            <v-text-field
                v-model.number="foodItem.nutrients.CARBS"
                :error-messages="foodNutrientsCARBSErrors"
                class="input-number"
                type="number"
                color="success"
                label="Net Carbs"
                suffix="g"
                @blur="$v.foodItem.nutrients.CARBS.$touch()"
                @input="$v.foodItem.nutrients.CARBS.$touch()"
                @change="foodItem.nutrients.CARBS <= 0 ? foodItem.nutrients.CARBS = 0 : null"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon color="success" :disabled="foodItem.nutrients.CARBS <= 0"
                       :style="{ cursor: foodItem.nutrients.CARBS <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement('CARBS')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-btn icon color="success" @click="increment('CARBS')">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="1" class="d-flex justify-center align-center pl-5">
            <v-icon color="blue darken-3">mdi-nutrition</v-icon>
          </v-col>
          <v-col cols="11" class="pl-0">
            <v-text-field
                v-model.number="foodItem.nutrients.PROTEIN"
                :error-messages="foodNutrientsPROTEINErrors"
                class="input-number"
                type="number"
                color="success"
                label="Protein"
                suffix="g"
                @blur="$v.foodItem.nutrients.PROTEIN.$touch()"
                @input="$v.foodItem.nutrients.PROTEIN.$touch()"
                @change="foodItem.nutrients.PROTEIN <= 0 ? foodItem.nutrients.PROTEIN = 0 : null"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon color="success" :disabled="foodItem.nutrients.PROTEIN <= 0"
                       :style="{ cursor: foodItem.nutrients.PROTEIN <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement('PROTEIN')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-btn icon color="success" @click="increment('PROTEIN')">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="1" class="d-flex justify-center align-center pl-5">
            <v-icon color="orange darken-3">mdi-nutrition</v-icon>
          </v-col>
          <v-col cols="11" class="pl-0">
            <v-text-field
                v-model.number="foodItem.nutrients.FAT"
                :error-messages="foodNutrientsFATErrors"
                class="input-number"
                type="number"
                color="success"
                label="Fat"
                suffix="g"
                @blur="$v.foodItem.nutrients.FAT.$touch()"
                @input="$v.foodItem.nutrients.FAT.$touch()"
                @change="foodItem.nutrients.FAT <= 0 ? foodItem.nutrients.FAT = 0 : null"
                hide-spin-buttons
            >
              <template v-slot:prepend>
                <v-btn icon color="success" :disabled="foodItem.nutrients.FAT <= 0"
                       :style="{ cursor: foodItem.nutrients.FAT <= 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                       @click="decrement('FAT')">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </template>
              <template v-slot:append-outer>
                <v-btn icon color="success" @click="increment('FAT')">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-card-text class="text-subtitle-1 white--text">Meal Time</v-card-text>
        <v-row>
          <v-col cols="12">
            <v-slide-group v-model="foodItem.mealTime" mandatory show-arrows>
              <v-slide-item v-for="mealTime in getMealTimes.labels" :key="mealTime" v-slot="{ active, toggle }">
                <v-btn class="mx-2" active-class="success" :input-value="active" depressed rounded @click="toggle">
                  {{ mealTime }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class="mx-4" />
      <v-card-actions>
        <v-btn color="success" text large @click="onClose">Cancel</v-btn>
        <v-spacer />
        <v-btn color="success" text large @click="onAddFood" :disabled="this.$v.$anyError" :loading="loading">Save</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="previewImage" scrollable>
      <v-card>
        <v-card-title class="text-h5">Preview Image</v-card-title>
        <v-card-text>
          <v-img :src="foodItem.image" :lazy-src="foodItem.image" alt="Preview image" title="Preview image" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="success" outlined block @click="previewImage = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, url, numeric, minValue } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { foodImage, foodNumerics, foodString, hasNotNumerics, hasNotSpecialChars } from "@/utils/validations";

export default {
  name: "CustomFoodDialog",
  mixins: [ validationMixin ],
  props: {
    customFoodDialog: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    dialog: false,
    loading: false,
    previewImage: null,
    measures: ['gram', 'kilogram', 'milliliter', 'liter'],
    foodItem: {
      label: '',
      category: '',
      image: '',
      mealTime: '',
      measure: 'gram',
      servings: null,
      nutrients: {
        CALS: null,
        CARBS: null,
        PROTEIN: null,
        FAT: null
      }
    }
  }),
  created() {
    this.dialog = this.customFoodDialog
    this.foodItem.mealTime = this.getMealTimes.labels.findIndex(item => item === this.getMealTime)
  },
  validations: {
    foodItem: {
      label: {
        required,
        hasNotSpecialChars,
        hasNotNumerics
      },
      image: {
        required,
        url
      },
      servings: {
        required,
        numeric,
        minValue: minValue(1)
      },
      nutrients: {
        CALS: {
          required,
          numeric
        },
        CARBS: {
          required,
          numeric
        },
        PROTEIN: {
          required,
          numeric
        },
        FAT: {
          required,
          numeric
        }
      }
    }
  },
  computed: {
    ...mapGetters('account', ['getUserValue']),
    ...mapGetters('food', ['getDate', 'getMealTime', 'getMealTimes', 'getCategories']),
    cursorType() {
      return this.foodItem.servings <= 0 ? 'not-allowed' : 'pointer'
    },
    suffix() {
      return this.measure === 'gram' ? 'g' : this.measure === 'kilogram' ? 'kg' : this.measure === 'liter' ? 'l' : 'ml'
    },
    coefficient() {
      return this.measure === 'gram' || this.measure === 'milliliter' ? 1 : 1000
    },
    reverseCoefficient() {
      return this.measure === 'gram' || this.measure === 'milliliter' ? 1000 : 1
    },
    measure() {
      return this.foodItem.measure
    },
    servings() {
      return this.foodItem.servings
    },
    nutrients() {
      return this.foodItem.nutrients
    },
    foodMealTime() {
      return this.getMealTimes.labels[this.foodItem.mealTime]
    },
    foodLabelErrors() {
      return foodString(this.$v.foodItem.label, 'Food label')
    },
    foodImageErrors() {
      return foodImage(this.$v.foodItem.image)
    },
    foodServingsErrors() {
      return foodNumerics(this.$v.foodItem.servings, 'Servings', 1)
    },
    foodNutrientsCALSErrors() {
      return foodNumerics(this.$v.foodItem.nutrients.CALS, 'Calories')
    },
    foodNutrientsCARBSErrors() {
      return foodNumerics(this.$v.foodItem.nutrients.CARBS, 'Net Carbs')
    },
    foodNutrientsPROTEINErrors() {
      return foodNumerics(this.$v.foodItem.nutrients.PROTEIN, 'Protein')
    },
    foodNutrientsFATErrors() {
      return foodNumerics(this.$v.foodItem.nutrients.FAT, 'Fat')
    }
  },
  methods: {
    ...mapActions('food', ['add', 'selectedMealTime']),
    ...mapActions('notification', ['setSnackbar']),
    increment(property) {
      if (typeof property === 'string') {
        if (!this.foodItem.nutrients[property]) this.foodItem.nutrients[property] = 1
        else this.foodItem.nutrients[property] += 1
      } else {
        if (!this.foodItem.servings) this.foodItem.servings = 1
        else this.foodItem.servings += 1
      }
    },
    decrement(property) {
      if (typeof property === 'string') this.foodItem.nutrients[property] -= 1
      else this.foodItem.servings -= 1
    },
    onAddFood() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        const payload = Object.assign({}, this.foodItem)
        payload.accountId = this.getUserValue.id
        payload.date = this.getDate
        payload.mealTime = this.foodMealTime
        payload.category = this.getCategories[this.foodItem.category].title
        console.log(payload)
        this.add(payload).then(response => {
          console.log(response)
          this.setSnackbar({ color: 'success', text: response.data.message })
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.onClose())
      }
    },
    onClose() {
      this.loading = false
      this.selectedMealTime('')
      this.$emit('close-dialog')
    },
    oneUnits() {
      const oneUnits = {}
      oneUnits.CALS = this.foodItem.nutrients.CALS / this.foodItem.servings / this.reverseCoefficient
      oneUnits.CARBS = this.foodItem.nutrients.CARBS / this.foodItem.servings / this.reverseCoefficient
      oneUnits.PROTEIN = this.foodItem.nutrients.PROTEIN / this.foodItem.servings / this.reverseCoefficient
      oneUnits.FAT = this.foodItem.nutrients.FAT / this.foodItem.servings / this.reverseCoefficient
      return oneUnits
    },
    setNutrients() {
      if (this.foodItem.servings > 0) {
        const oneUnits = this.oneUnits()
        console.log(oneUnits)
        this.foodItem.nutrients.CALS = parseInt(oneUnits.CALS * this.foodItem.servings * this.coefficient, 10)
        this.foodItem.nutrients.CARBS = parseInt(oneUnits.CARBS * this.foodItem.servings * this.coefficient, 10)
        this.foodItem.nutrients.PROTEIN = parseInt(oneUnits.PROTEIN * this.foodItem.servings * this.coefficient, 10)
        this.foodItem.nutrients.FAT = parseInt(oneUnits.FAT * this.foodItem.servings * this.coefficient, 10)
      }
    },
  },
  watch: {
    coefficient() {
      this.setNutrients()
    },
  },
  filters: {
    fixed(number) {
      return number > 0 ? number.toFixed(2) : 0
    }
  }
}
</script>
