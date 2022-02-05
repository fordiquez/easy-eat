<template>
  <div>
    <v-alert v-if="status.error" v-model="status.error" type="error" border="left" colored-border dismissible prominent dense text>
      <span>{{ message.error }}</span>
    </v-alert>
    <v-alert v-if="status.success" v-model="status.success" type="success" border="left" colored-border dismissible prominent dense text>
      <span>{{ message.success }}</span>
    </v-alert>
    <v-alert v-if="status.info" v-model="status.info" type="info" color="primary" border="left" colored-border dismissible prominent dense text>
      <span>{{ message.info }}</span>
    </v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Alert",
  computed: {
    ...mapState('alert', ['status', 'message'])
  }
}
</script>
