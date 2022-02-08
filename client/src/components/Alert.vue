<template>
  <div>
    <v-alert
        v-for="(alert, index) in activeAlerts"
        :key="index"
        v-model="alert.active"
        :type="alert.type"
        :color="alert.type === 'info' ? 'primary' : alert.type"
        border="left"
        colored-border dismissible prominent dense text>
      <span>{{ alert.text }}</span>
    </v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Alert",
  computed: {
    ...mapState('notifications', ['alerts']),
    activeAlerts() {
      return this.alerts.filter(alert => alert.active)
    }
  }
}
</script>
