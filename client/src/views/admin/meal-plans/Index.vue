<template>
  <v-card>
    <v-data-table
        v-if="getPlans"
        :headers="headers"
        :items="getPlans"
        :items-per-page="10"
        :search="search"
        :loading="loading"
    >
      <template v-slot:loading>
        <v-progress-circular indeterminate color="success" class="my-5" />
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title v-show="$vuetify.breakpoint.smAndUp">Meal Plans</v-toolbar-title>
          <v-divider v-show="$vuetify.breakpoint.smAndUp" class="mx-4" inset vertical />
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search the meal plan"
              placeholder="Please enter at least 1 character of the meal plan title"
              ref="search"
              @keydown.esc="onSearch"
              @click="onSearch"
              hide-details
          />
          <v-btn class="ml-3" color="success" @click="isCreating = dialog = true">
            <v-icon class="mr-1">mdi-file-plus</v-icon>
            <span>Add meal plan</span>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.proportions.CARBS="{ item }">
        <v-chip color="red">{{ item.proportions.CARBS }} %</v-chip>
      </template>
      <template v-slot:item.proportions.PROTEIN="{ item }">
        <v-chip color="light-blue">{{ item.proportions.PROTEIN }} %</v-chip>
      </template>
      <template v-slot:item.proportions.FAT="{ item }">
        <v-chip color="orange">{{ item.proportions.FAT }} %</v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom color="success">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="success" v-on="on" @bind="attrs" :to="{ name: 'MealPlanView', params: { id: item.id } }">
              <v-icon small>mdi-file-eye</v-icon>
            </v-btn>
          </template>
          <span>View detailed info</span>
        </v-tooltip>
        <v-tooltip bottom color="blue">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small class="mr-2" color="blue" v-bind="attrs" v-on="on" @click="onEditDialog(item)">mdi-file-document-edit</v-icon>
          </template>
          <span>Edit meal plan</span>
        </v-tooltip>
        <v-tooltip bottom color="red">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="red" v-bind="attrs" v-on="on" @click="onDeleteDialog(item)">mdi-file-remove</v-icon>
          </template>
          <span>Delete meal plan</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        <v-card-title class="justify-center text-subtitle-1">Meal plans not found</v-card-title>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="500" :fullscreen="$vuetify.breakpoint.xsOnly" @input="onClose">
      <v-card :loading="loading">
        <v-toolbar color="success" dense>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5" @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="editedPlan.title"
                    :error-messages="titleErrors"
                    label="Title"
                    placeholder="Enter title"
                    @blur="$v.editedPlan.title.$touch()"
                    @input="$v.editedPlan.title.$touch()"
                >
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-file-document-edit</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-card-title class="text-subtitle-1 white--text pl-0">Macronutrient proportions</v-card-title>
            <v-row>
              <v-col cols="1" class="d-flex justify-center align-center pl-5">
                <v-icon color="red">mdi-nutrition</v-icon>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.xsOnly ? 10 : 11" class="px-0">
                <v-text-field
                    v-model.number="editedPlan.proportions.CARBS"
                    :error-messages="CarbsErrors && proportionsErrors"
                    class="input-number"
                    suffix="g"
                    type="number"
                    label="Net Carbs"
                    placeholder="Enter percentage proportions value"
                    @blur="$v.editedPlan.proportions.CARBS.$touch()"
                    @input="$v.editedPlan.proportions.CARBS.$touch()"
                    hide-spin-buttons
                >
                  <template v-slot:prepend>
                    <v-btn icon color="success" :disabled="editedPlan.proportions.CARBS <= 0"
                           :style="{ cursor: editedPlan.proportions.CARBS === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                           @click="decrement('CARBS')">
                      <v-icon>mdi-numeric-negative-1</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon color="success" @click="increment('CARBS')">
                      <v-icon>mdi-numeric-positive-1</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="1" class="d-flex justify-center align-center pl-5">
                <v-icon color="light-blue">mdi-nutrition</v-icon>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.xsOnly ? 10 : 11" class="px-0">
                <v-text-field
                    v-model.number="editedPlan.proportions.PROTEIN"
                    :error-messages="ProteinErrors && proportionsErrors"
                    class="input-number"
                    suffix="g"
                    type="number"
                    label="Protein"
                    placeholder="Enter percentage proportions value"
                    @blur="$v.editedPlan.proportions.PROTEIN.$touch()"
                    @input="$v.editedPlan.proportions.PROTEIN.$touch()"
                    hide-spin-buttons
                >
                  <template v-slot:prepend>
                    <v-btn icon color="success" :disabled="editedPlan.proportions.PROTEIN <= 0"
                           :style="{ cursor: editedPlan.proportions.PROTEIN === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                           @click="decrement('PROTEIN')">
                      <v-icon>mdi-numeric-negative-1</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon color="success" @click="increment('PROTEIN')">
                      <v-icon>mdi-numeric-positive-1</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="1" class="d-flex justify-center align-center pl-5">
                <v-icon color="orange">mdi-nutrition</v-icon>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.xsOnly ? 10 : 11" class="px-0">
                <v-text-field
                    v-model.number="editedPlan.proportions.FAT"
                    :error-messages="FatErrors && proportionsErrors"
                    class="input-number"
                    suffix="g"
                    type="number"
                    label="Fat"
                    placeholder="Enter percentage proportions value"
                    @blur="$v.editedPlan.proportions.FAT.$touch()"
                    @input="$v.editedPlan.proportions.FAT.$touch()"
                    hide-spin-buttons
                >
                  <template v-slot:prepend>
                    <v-btn icon color="success" :disabled="editedPlan.proportions.FAT <= 0"
                           :style="{ cursor: editedPlan.proportions.FAT === 0 ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }"
                           @click="decrement('FAT')">
                      <v-icon>mdi-numeric-negative-1</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append-outer>
                    <v-btn icon color="success" @click="increment('FAT')">
                      <v-icon>mdi-numeric-positive-1</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="success" @click="onClose">Cancel</v-btn>
          <v-spacer />
          <v-btn v-if="isCreating" color="success" :disabled="$v.$anyError || loading" :loading="loading" @click="onCreate">
            <v-icon class="mr-1" small>mdi-file-document-edit</v-icon>
            <span>Create</span>
          </v-btn>
          <v-btn v-else color="success" :disabled="$v.$anyError || loading" :loading="loading" @click="onUpdate">
            <v-icon class="mr-1" small>mdi-file-remove</v-icon>
            <span>Update</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isDeleting" max-width="500" @input="onClose">
      <v-card>
        <v-card-title class="text-h5">{{ dialogTitle }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="success" @click="onClose">Cancel</v-btn>
          <v-btn text color="red" :disabled="loading" :loading="loading" @click="onDeleteConfirm">
            <v-icon class="mr-1" small>mdi-file-remove</v-icon>
            <span>Confirm</span>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import {proportions, validationRules} from "@/utils/validations";

export default {
  name: 'MealPlans',
  mixins: [ validationMixin ],
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    search: '',
    dialog: false,
    loading: false,
    isSearching: false,
    isCreating: false,
    isEditing: false,
    isDeleting: false,
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Carbs', value: 'proportions.CARBS', filterable: false },
      { text: 'Protein', value: 'proportions.PROTEIN', filterable: false },
      { text: 'Fat', value: 'proportions.FAT', filterable: false },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedPlan: null
  }),
  created() {
    this.loading = true
    this.editedPlan = Object.assign({}, this.defaultPlan)
    this.getAll().catch(error => {
      console.log(error.response)
      this.setSnackbar({ color: 'error', text: error.response.data.message })
    }).finally(() => this.loading = false)
  },
  validations: {
    editedPlan: {
      title: {
        required
      },
      proportions: {
        proportions,
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
    ...mapGetters('mealPlan', ['getPlans']),
    dialogTitle() {
      return this.isCreating ? 'Creating new Meal Plan' : this.isEditing ? 'Editing meal plan: ' + this.getPlans[this.editedIndex].title : this.isDeleting ? 'Delete meal plan: ' + this.editedPlan.title + '?' : null
    },
    defaultPlan() {
      return {
        title: '',
        proportions: {
          CARBS: null,
          PROTEIN: null,
          FAT: null
        }
      }
    },
    titleErrors() {
      return validationRules(this.$v.editedPlan.title, 'Title')
    },
    CarbsErrors() {
      return validationRules(this.$v.editedPlan.proportions.CARBS, 'CARBS')
    },
    ProteinErrors() {
      return validationRules(this.$v.editedPlan.proportions.PROTEIN, 'PROTEIN')
    },
    FatErrors() {
      return validationRules(this.$v.editedPlan.proportions.FAT, 'FAT')
    },
    proportionsErrors() {
      return proportions(this.editedPlan.proportions)
    }
  },
  methods: {
    ...mapActions('notification', ['setSnackbar']),
    ...mapActions('mealPlan', ['getAll', 'create', 'update', 'delete']),
    onEditDialog(item) {
      this.editedIndex = this.getPlans.indexOf(item)
      this.editedPlan = Object.assign({}, item)
      this.dialog = this.isEditing = true
    },
    onDeleteDialog(item) {
      this.editedIndex = this.getPlans.indexOf(item)
      this.editedPlan = Object.assign({}, item)
      this.isDeleting = true
    },
    onClose() {
      this.dialog = this.isCreating = this.isEditing = this.isDeleting = false
      this.$v.$reset()
      this.$nextTick(() => {
        this.editedPlan = Object.assign({}, this.defaultPlan)
        this.editedIndex = -1
      })
    },
    onCreate() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.create(this.editedPlan).then(response => {
          console.log(response)
          this.setSnackbar({ color: 'success', text: response.data.message })
          this.onClose()
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    },
    onUpdate() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.update(this.editedPlan).then(response => {
          console.log(response)
          this.setSnackbar({ color: 'success', text: response.data.message })
          this.onClose()
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    },
    onDeleteConfirm() {
      this.loading = true
      this.delete(this.editedPlan.id).then(response => {
        console.log(response)
        this.onClose()
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.loading = false)
    },
    onSearch() {
      this.isSearching = !this.isSearching
      if (!this.isSearching && !this.search.length) setTimeout(() => this.$refs.search.blur(), 0)
    },
    increment(property) {
      if (!this.editedPlan.proportions[property]) this.editedPlan.proportions[property] = 1
      else this.editedPlan.proportions[property] += 1
    },
    decrement(property) {
      if (!this.editedPlan.proportions[property]) this.editedPlan.proportions[property] = 1
      else this.editedPlan.proportions[property] -= 1
    },
  },
  watch: {
    dialog(value) {
      if (!value) this.editedPlan.title = this.editedPlan.proportions.CARBS = this.editedPlan.proportions.PROTEIN = this.editedPlan.proportions.FAT = null
    }
  }
}
</script>
