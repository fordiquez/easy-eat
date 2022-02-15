<template>
  <v-card v-if="account" flat>
    <v-card-title>
      <span class="text-h5">Account Settings</span>
    </v-card-title>
    <v-container fluid>
      <v-form>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                v-model="account.email"
                prepend-icon="mdi-email-outline"
                label="Email address"
                :loading="updateEmailDialog"
                readonly disabled
            >
              <v-btn slot="append" color="success" class="mb-2" @click="updateEmailDialog = true" text>Update Email</v-btn>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
                value="************"
                type="password"
                prepend-icon="mdi-lock-outline"
                label="Current password"
                autocomplete="current_password"
                :loading="updatePasswordDialog"
                readonly disabled
            >
              <v-btn slot="append" color="success" class="mb-2" @click="updatePasswordDialog = true" text>Update Password</v-btn>
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <UpdateEmailDialog
        v-if="updateEmailDialog"
        :account-id="account.id"
        :update-email-dialog="updateEmailDialog"
        @close-dialog="updateEmailDialog = false"
        @updated-email="updatedEmail"
    />
    <UpdatePasswordDialog
        v-if="updatePasswordDialog"
        :account-id="account.id"
        :update-password-dialog="updatePasswordDialog"
        @close-dialog="updatePasswordDialog = false"
    />
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import UpdateEmailDialog from "@/components/dialogs/UpdateEmail";
import UpdatePasswordDialog from "@/components/dialogs/UpdatePassword";

export default {
  name: "AccountSettings",
  components: { UpdateEmailDialog, UpdatePasswordDialog },
  mixins: [ validationMixin ],
  props: {
    user: {
      type: [Object, Boolean],
      default: null
    }
  },
  data: () => ({
    account: null,
    updateEmailDialog: false,
    updatePasswordDialog: false,
    loading: false,
  }),
  mounted() {
    this.account = this.user
    console.log("account: " + this.account.id)
  },
  methods: {
    updatedEmail(email) {
      this.account.email = email
    },
  }
}
</script>
