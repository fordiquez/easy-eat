<template>
  <v-flex>
    <v-snackbar
        v-for="(snackbar, index) in activeSnackbars"
        :key="snackbar.id"
        v-model="snackbar.active"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        :style="{ bottom: `${(index * 60) + 8}px` }"
        :right="snackbar.position === 'right'"
        :min-width="$vuetify.breakpoint.xsOnly ? 'fit-content' : ''"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.active = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-flex>
</template>

<script>
import { mapState } from "vuex";

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
