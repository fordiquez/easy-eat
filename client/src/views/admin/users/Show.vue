<template>
  <v-card v-if="user" max-width="375" class="mx-auto mt-3">
    <v-img v-if="avatarPath" max-height="300" :src="avatarPath" :lazy-src="avatarPath" :alt="imageText" :title="imageText">
      <v-tooltip :left="$vuetify.breakpoint.smAndUp" :right="$vuetify.breakpoint.xsOnly" color="success">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon class="mt-1 ml-1" v-on="on" @bind="attrs" :to="{ name: 'Users' }">
            <v-icon color="success">mdi-chevron-left</v-icon>
          </v-btn>
        </template>
        <span>Back to Admin Users</span>
      </v-tooltip>

    </v-img>

    <v-flex v-else class="d-flex align-center">
      <v-btn icon :to="{ name: 'Users' }" exact-path>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-icon color="success" size="70">mdi-account-circle</v-icon>
      <v-spacer />
    </v-flex>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ user.firstName }}</v-list-item-title>
          <v-list-item-subtitle>First Name</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ user.lastName }}</v-list-item-title>
          <v-list-item-subtitle>Last Name</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-email</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ user.email }}</v-list-item-title>
          <v-list-item-subtitle>Email address</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="verifiedDate">
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-calendar-sync</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ verifiedDate }}</v-list-item-title>
          <v-list-item-subtitle>Email verified</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-account-supervisor</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title>{{ user.role }}</v-list-item-title>
          <v-list-item-subtitle>Role</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item>
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-account-clock</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ createdDate }}</v-list-item-title>
          <v-list-item-subtitle>Account created</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="updatedDate">
        <v-list-item-icon class="mb-0">
          <v-icon color="success">mdi-account-edit</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="py-0">
          <v-list-item-title :style="style">{{ updatedDate }}</v-list-item-title>
          <v-list-item-subtitle>Account updated</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { accountService } from "@/services";

export default {
  name: "UserView",
  data: () => ({
    user: null,
    loading: false,
    avatarPath: null,
  }),
  created() {
    this.loading = true
    accountService.getById(this.$route.params.id).then(response => {
      console.log(response)
      this.user = response.data
      if (this.user.avatar) {
        this.avatarPath = `${process.env.VUE_APP_BASE_API_URL}${process.env.VUE_APP_ACCOUNT_AVATAR_PATH}/${this.user.id}`
      }
    }).catch(error => {
      console.log(error.response)
      this.setSnackbar({ color: 'error', text: error.response.data.message })
    }).finally(() => this.loading = false)
  },
  computed: {
    imageText() {
      return this.user ? this.user.firstName + ' ' + this.user.lastName : null
    },
    verifiedDate() {
      return this.user?.verified ? new Date(this.user.verified).toUTCString() : null
    },
    createdDate() {
      return new Date(this.user.created).toUTCString()
    },
    updatedDate() {
      return this.user?.updated ? new Date(this.user.updated).toUTCString() : null
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

