<template>
  <v-card v-if="account">
    <v-card-title>
      <span class="text-h5">Account Settings</span>
    </v-card-title>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="8" md="5" xl="4">
          <v-text-field
              v-model="account.email"
              prepend-icon="mdi-email-outline"
              label="Email address"
              :loading="updateEmailDialog"
              readonly disabled>
            <template v-slot:append>
              <v-btn text color="success" class="mb-2" @click="updateEmailDialog = true">Update Email</v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="5" xl="4">
          <v-text-field
              value="************"
              type="password"
              prepend-icon="mdi-lock-outline"
              label="Current password"
              autocomplete="current_password"
              :loading="updatePasswordDialog"
              readonly disabled>
            <template v-slot:append>
              <v-btn text color="success" class="mb-2" @click="updatePasswordDialog = true">Update Password</v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="5" xl="4">
          <v-card-title>Delete Account</v-card-title>
          <v-card-text class="grey--text">{{ deleteText }}</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="red" @click="deleteDialog = true">
              <v-icon class="mr-1">mdi-delete</v-icon>
              <span>Delete Account</span>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
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
    <template>
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-form @submit.prevent="onDelete">
            <v-card-title class="text-h5">Delete Account</v-card-title>
            <v-card-text>{{ deleteText }}</v-card-text>
            <v-text-field v-model="deleteField" class="px-5" label="Please type in «delete account» to confirm the action" />
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text color="success" @click="deleteDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="success" :disabled="deleteField !== 'delete account'" type="submit">I accept</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </template>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import UpdateEmailDialog from "@/components/dialogs/UpdateEmail";
import UpdatePasswordDialog from "@/components/dialogs/UpdatePassword";
import { mapActions } from "vuex";

export default {
  name: "AccountSettings",
  components: { UpdateEmailDialog, UpdatePasswordDialog },
  mixins: [ validationMixin ],
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    account: null,
    deleteDialog: false,
    updateEmailDialog: false,
    updatePasswordDialog: false,
    loading: false,
    deleteText: 'Select this option if you wish to delete your account and all of your data. Please be aware that once your account is deleted you will no longer have access to it. This action cannot be undone.',
    deleteField: null
  }),
  created() {
    this.account = this.user
  },
  methods: {
    ...mapActions('account', ['delete']),
    ...mapActions('notification', ['setSnackbar']),
    updatedEmail(email) {
      this.account.email = email
    },
    onDelete() {
      this.loading = true
      this.delete(this.account.id).then(response => {
        this.$router.push({ name: 'Login' }).then(() => {
          this.setSnackbar({ color: 'success', text: response.data.message })
        })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.loading = false)
    }
  }
}
</script>
