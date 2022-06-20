<template>
  <v-card v-if="mealPlan" max-width="375" class="mx-auto mt-3">
    <v-flex class="d-flex align-center">
      <v-btn icon :to="{ name: 'MealPlans' }" exact-path>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-card-text class="text-center text-h6">{{ mealPlan.title }}</v-card-text>
    </v-flex>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="red">mdi-nutrition</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ mealPlan.proportions.CARBS }} %</v-list-item-title>
          <v-list-item-subtitle>Net Carbs</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="light-blue">mdi-nutrition</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ mealPlan.proportions.PROTEIN }} %</v-list-item-title>
          <v-list-item-subtitle>Protein</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="orange">mdi-nutrition</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ mealPlan.proportions.CARBS }} %</v-list-item-title>
          <v-list-item-subtitle>Fat</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-calendar-sync</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ createdDate }}</v-list-item-title>
          <v-list-item-subtitle>Plan created</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="updatedDate">
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-calendar-edit</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ updatedDate }}</v-list-item-title>
          <v-list-item-subtitle>Plan updated</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { mealPlanService } from "@/services";

export default {
  name: "MealPlanView",
  metaInfo: {
    title: 'Meal Plan View | Admin Panel'
  },
  data: () => ({
    mealPlan: null,
    loading: false,
    avatarPath: null,
  }),
  created() {
    this.loading = true
    mealPlanService.getById(this.$route.params.id).then(response => {
      console.log(response)
      this.mealPlan = response.data
    }).catch(error => {
      console.log(error.response)
      this.setSnackbar({ color: 'error', text: error.response.data.message })
    }).finally(() => this.loading = false)
  },
  computed: {
    createdDate() {
      return new Date(this.mealPlan.created).toUTCString()
    },
    updatedDate() {
      return this.mealPlan?.updated ? new Date(this.mealPlan.updated).toUTCString() : null
    },
    style() {
      return { whiteSpace: 'break-spaces' }
    }
  },
  methods: {
    ...mapActions('notification', ['setSnackbar'])
  }
}
</script>

