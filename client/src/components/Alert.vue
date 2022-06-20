<template>
  <v-flex>
    <v-alert
        v-for="alert in activeAlerts"
        :key="alert.id"
        v-model="alert.active"
        :type="alert.type"
        :color="alert.type"
        border="left"
        colored-border dismissible prominent dense text>
      <span>{{ alert.text }}</span>
    </v-alert>
  </v-flex>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Alert",
  computed: {
    ...mapGetters('notification', ['activeAlerts']),
  }
}
</script>
