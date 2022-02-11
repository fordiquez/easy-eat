<template>
  <v-card v-if="app" flat>
    <v-card-title>
      <span class="text-h5">App settings</span>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "AppSettings",
  props: {
    user: {
      type: [Object, Boolean],
      default: null
    }
  },
  data() {
    return {
      app: this.user
    }
  },
  async mounted() {
    console.log("app: " + this.app.id)
  },
}
</script>
