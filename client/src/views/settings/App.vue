<template>
  <v-card v-if="app">
    <v-card-title class="text-h5">App settings</v-card-title>
    <v-container>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="6" xl="4">
          <v-flex class="d-flex align-center">
            <v-card-title class=" mr-5">Enable daily macros</v-card-title>
            <v-switch v-model="application.dailyMacrosPie" @change="updateSettings" inset />
          </v-flex>
          <v-card-text class="py-0 grey--text text-subtitle-2">Display pie chart for daily macros percentage in a Daily Log</v-card-text>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="6" xl="4">
          <v-flex class="d-flex align-center">
            <v-card-title class=" mr-5">Enable macros goals</v-card-title>
            <v-switch v-model="application.macrosGoalsPie" @change="updateSettings" inset />
          </v-flex>
          <v-card-text class="py-0 grey--text text-subtitle-2">Display pie chart for macros goals percentage in a Daily Log</v-card-text>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="6" xl="4">
          <v-flex class="d-flex align-center">
            <v-card-title class=" mr-5">Enable calories & macros tracker</v-card-title>
            <v-switch v-model="application.tracker" @change="updateSettings" inset />
          </v-flex>
          <v-card-text class="py-0 grey--text text-subtitle-2">Display daily calories and macronutrients information based on added food in a Daily Log</v-card-text>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="6" xl="4">
          <v-flex class="d-flex align-center">
            <v-card-title class=" mr-5">Enable recommended calories</v-card-title>
            <v-switch v-model="application.recommended" @change="updateSettings" inset />
          </v-flex>
          <v-card-text class="py-0 grey--text text-subtitle-2">Display recommended total and remaining amount of calories for each meal in a Daily Log</v-card-text>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="6" xl="4">
          <v-card-title>Bulk delete foods data</v-card-title>
          <v-card-text class="grey--text text-subtitle-2">{{ deleteText }}</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="red" @click="deleteDialog = true">
              <v-icon class="mr-1">mdi-delete</v-icon>
              <span>Delete foods data</span>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
    <template>
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-form @submit.prevent="onDelete">
            <v-card-title class="text-h5">Delete Account</v-card-title>
            <v-card-text>{{ deleteText }}</v-card-text>
            <v-text-field v-model="deleteField" class="px-5" label="Please type in «delete foods data» to confirm the action" />
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text color="success" @click="deleteDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="success" :disabled="deleteField !== 'delete foods data'" type="submit">I accept</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </template>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "AppSettings",
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  metaInfo: {
    title: 'App Settings'
  },
  data: () => ({
    app: null,
    application: null,
    deleteDialog: false,
    deleteText: 'Select this option if you wish to delete all data about added foods in the daily log. Please be aware that once your foods data is deleted you will no longer have access to it. This action cannot be undone.',
    deleteField: ''
  }),
  created() {
    this.app = this.user
    this.application = this.getApplication
  },
  computed: {
    ...mapGetters('application', ['getApplication']),
  },
  methods: {
    ...mapActions('food', ['bulkDelete']),
    ...mapActions('application', ['update']),
    ...mapActions('notification', ['setSnackbar', 'setAlert']),
    onDelete() {
      const accountId = this.app.id
      this.bulkDelete({ accountId }).then(response => {
        console.log(response)
        this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => [this.deleteDialog, this.deleteField] = [false, null])
    },
    updateSettings() {
      this.update(this.application)
    }
  }
}
</script>
