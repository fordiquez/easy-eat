<template>
  <div>
    <v-snackbar
        v-for="(snackbar, index) in activeSnackbars"
        :key="snackbar.createdAt"
        v-model="snackbar.active"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        :style="{ bottom: `${(index * 60) + 8}px`}"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.active = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Snackbar",
  computed: {
    ...mapState('notification', ['snackbars']),
    activeSnackbars() {
      return this.snackbars.filter(s => s.active && s.createdAt > new Date().getTime() - 5000)
    }
  },
}
</script>
