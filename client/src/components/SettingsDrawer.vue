<template>
  <v-container>
    <v-list class="pt-0">
      <v-list-item-group class="mx-auto">
        <v-list-item-title class="mb-0 pl-1 text-subtitle-2 font-weight-black">Navigation drawer</v-list-item-title>
        <v-list-item-content class="pt-0">
          <v-row class="mx-auto" dense>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isDrawer.active" @click="onDrawer" rounded>
                <span>Show</span>
                <v-icon right>mdi-projector-screen-variant</v-icon>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isDrawer.inactive" @click="offDrawer" rounded>
                <span>Hide</span>
                <v-icon right>mdi-projector-screen-variant-off</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-group>
      <v-flex class="mt-2 mb-3 mx-n3">
        <v-divider />
      </v-flex>
      <v-list-item-group>
        <v-list-item-title class="mb-0 pl-1 text-subtitle-2 font-weight-black">Drawer variant</v-list-item-title>
        <v-list-item-content class="pt-0">
          <v-row class="mx-auto" dense>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isMiniVariant.active" @click="onMiniVariant" rounded>
                <span>Mini</span>
                <v-icon right>mdi-window-minimize</v-icon>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isMiniVariant.inactive" @click="offMiniVariant" rounded>
                <span>Full</span>
                <v-icon right>mdi-fullscreen</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-group>
      <v-flex class="mt-2 mb-3 mx-n3">
        <v-divider />
      </v-flex>
      <v-list-item-group>
        <v-list-item-title class="mb-0 pl-1 text-subtitle-2 font-weight-black">Clipped drawer</v-list-item-title>
        <v-list-item-content class="pt-0">
          <v-row class="mx-auto" dense>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isClipped.active" @click="onClipped" rounded>
                <span>Clipped</span>
                <v-icon right>mdi-scissors-cutting</v-icon>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isClipped.inactive" @click="offClipped" rounded>
                <span>Unclipped</span>
                <v-icon right>mdi-window-maximize</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-group>
      <v-flex class="mt-2 mb-3 mx-n3">
        <v-divider />
      </v-flex>
      <v-list-item-group>
        <v-list-item-title class="mb-0 pl-1 text-subtitle-2 font-weight-black">Fixed footer</v-list-item-title>
        <v-list-item-content class="pt-0">
          <v-row class="mx-auto" dense>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isFixed.active" @click="onFixed" rounded>
                <span class="hidden-sm-and-down">Fixed</span>
                <v-icon right>mdi-pin</v-icon>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="py-3 px-4 d-flex align-center justify-center" :color="isFixed.inactive" @click="offFixed" rounded>
                <span class="hidden-sm-and-down">Unfixed</span>
                <v-icon right>mdi-pin-off-outline</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SettingsDrawer",
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  computed: {
    isClipped() {
      const colors = {}
      this.application.clipped ? colors.active = 'success' : colors.inactive = 'success'
      return colors
    },
    isDrawer() {
      const colors = {}
      this.application.drawer ? colors.active = 'success' : colors.inactive = 'success'
      return colors
    },
    isFixed() {
      const colors = {}
      this.application.fixed ? colors.active = 'success' : colors.inactive = 'success'
      return colors
    },
    isMiniVariant() {
      const colors = {}
      this.application.miniVariant ? colors.active = 'success' : colors.inactive = 'success'
      return colors
    },
  },
  methods: {
    ...mapActions('application', ['update']),
    onClipped() {
      this.application.clipped = true
      this.update(this.application)
    },
    offClipped() {
      this.application.clipped = false
      this.update(this.application)
    },
    onDrawer() {
      this.application.drawer = true
      this.update(this.application)
    },
    offDrawer() {
      this.application.drawer = false
      this.update(this.application)
    },
    onFixed() {
      this.application.fixed = true
      this.update(this.application)
    },
    offFixed() {
      this.application.fixed = false
      this.update(this.application)
    },
    onMiniVariant() {
      this.application.miniVariant = true
      this.update(this.application)
    },
    offMiniVariant() {
      this.application.miniVariant = false
      this.update(this.application)
    }
  },
}
</script>
