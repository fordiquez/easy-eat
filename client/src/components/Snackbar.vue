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
import { mapGetters } from "vuex";

export default {
  name: "Snackbar",
  computed: {
    ...mapGetters('notification', ['activeSnackbars']),
  },
}
</script>
