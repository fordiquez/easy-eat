<template>
  <v-card>
    <v-data-table
        v-if="getUsers"
        :headers="headers"
        :items="getUsers"
        :items-per-page="10"
        :search="search"
        :loading="loading"
    >
      <template v-slot:loading>
        <v-progress-circular indeterminate color="success" class="my-5" />
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title v-show="$vuetify.breakpoint.smAndUp">Users</v-toolbar-title>
          <v-divider v-show="$vuetify.breakpoint.smAndUp" class="mx-4" inset vertical />
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search the user account"
              placeholder="Please enter at least 1 character of the user account email address"
              ref="search"
              @keydown.esc="onSearch"
              @click="onSearch"
              hide-details
          />
          <v-btn class="ml-3" color="success" @click="isCreating = true">
            <v-icon class="mr-1">mdi-account-plus</v-icon>
            <span>Add user</span>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom color="success">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="success" v-on="on" @bind="attrs" :to="{ name: 'UserView', params: { id: item.id } }">
              <v-icon small>mdi-account-eye</v-icon>
            </v-btn>
          </template>
          <span>View detailed info</span>
        </v-tooltip>
        <v-tooltip bottom color="blue">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small class="mr-2" color="blue" v-bind="attrs" v-on="on" @click="onEditUser(item)">mdi-account-edit</v-icon>
          </template>
          <span>Edit user account</span>
        </v-tooltip>
        <v-tooltip bottom color="red">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="red" v-bind="attrs" v-on="on" @click="onDeleteUser(item)">mdi-account-remove</v-icon>
          </template>
          <span>Delete user account</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        <v-card-title class="justify-center text-subtitle-1">Users not found</v-card-title>
      </template>
    </v-data-table>
    <create-user v-if="isCreating" :is-creating="isCreating" @close-dialog="onClose" />
    <v-dialog v-model="isEditing" max-width="700" :fullscreen="$vuetify.breakpoint.xsOnly" @input="onClose">
      <v-card :loading="loading">
        <v-toolbar color="success" dense>
          <v-toolbar-title>{{ editingTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5" @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form @submit.prevent="onSubmit">
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="editedUser.firstName"
                      :error-messages="firstNameErrors"
                      label="First name"
                      prepend-icon="mdi-account-outline"
                      placeholder="Enter your first name"
                      ref="firstName"
                      @blur="$v.editedUser.firstName.$touch()"
                      @input="$v.editedUser.firstName.$touch()"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="editedUser.lastName"
                      :error-messages="lastNameErrors"
                      label="Last Name"
                      prepend-icon="mdi-account-outline"
                      placeholder="Enter your last name"
                      @blur="$v.editedUser.lastName.$touch()"
                      @input="$v.editedUser.lastName.$touch()"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="editedUser.email"
                      :error-messages="emailErrors"
                      label="Email address"
                      prepend-icon="mdi-email-outline"
                      placeholder="Enter your email address"
                      @blur="$v.editedUser.email.$touch()"
                      @input="$v.editedUser.email.$touch()"
                  />
                </v-col>
                <v-col cols="12">
                  <v-icon class="mr-3">mdi-account-multiple</v-icon>
                  <label class="text-subtitle-1" :class="$vuetify.breakpoint.smAndUp ? 'mr-3' : ''">Role</label>
                  <v-btn-toggle v-model="editedUser.role" :class="$vuetify.breakpoint.xsOnly ? 'd-flex justify-center' : ''" mandatory shaped>
                    <v-btn value="User" text :style="$vuetify.breakpoint.xsOnly ? { width: '50%' } : ''" :color="editedUser.role === 'User' ? 'success' : ''"
                    >
                      <v-icon :color="editedUser.role === 'User' ? 'success' : ''">mdi-account</v-icon>
                      <v-card-text class="text-subtitle-1 text-capitalize">User</v-card-text>
                    </v-btn>
                    <v-btn value="Admin" text :style="$vuetify.breakpoint.xsOnly ? { width: '50%' } : ''" :color="editedUser.role === 'Admin' ? 'success' : ''"
                    >
                      <v-icon :color="editedUser.role === 'Admin' ? 'success' : ''">mdi-account-lock</v-icon>
                      <v-card-text class="text-subtitle-1 text-capitalize">Admin</v-card-text>
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-btn text color="success" @click="onClose">Cancel</v-btn>
            <v-spacer />
            <v-btn color="success" type="submit" :disabled="($v.$invalid && $v.$error) || loading" :loading="loading">
              <v-icon class="mr-1">mdi-account-edit</v-icon>
              <span>Update</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isDeleting" max-width="700" @input="onClose">
      <v-card>
        <v-card-title class="text-h5 d-flex justify-center">{{ deletingTitle }}</v-card-title>
        <v-card-actions>
          <v-btn text color="success" @click="onClose">Cancel</v-btn>
          <v-spacer />
          <v-btn text color="red" @click="onDeleteUserConfirm">
            <v-icon class="mr-1">mdi-account-remove</v-icon>
            <span>Confirm</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { alpha, email, minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { validationRules } from "@/utils/validations";
import CreateUser from "@/components/dialogs/CreateUser";

export default {
  name: 'Users',
  components: {
    CreateUser
  },
  mixins: [ validationMixin ],
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    search: '',
    loading: false,
    isSearching: false,
    isCreating: false,
    isEditing: false,
    isDeleting: false,
    passwordVisibility: false,
    passwordConfirmVisibility: false,
    headers: [
      { text: 'Email address', value: 'email' },
      { text: 'First Name', value: 'firstName', filterable: false },
      { text: 'Last Name', value: 'lastName', filterable: false },
      { text: 'Role', value: 'role', filterable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedUser: {
      firstName: '',
      lastName: '',
      email: '',
      role: ''
    },
  }),
  created() {
    this.loading = true
    this.getAll().catch(error => {
      console.log(error.response)
      this.setSnackbar({ color: 'error', text: error.response.data.message })
    }).finally(() => this.loading = false)
  },
  validations: {
    editedUser: {
      firstName: {
        required,
        alpha,
        minLength: minLength(2)
      },
      lastName: {
        required,
        alpha,
        minLength: minLength(2)
      },
      email: {
        required,
        email
      },
      role: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('account', ['getUsers', 'getUserValue']),
    editingTitle() {
      const fullName = this.editedIndex !== -1 ? this.getUsers[this.editedIndex]?.firstName + ' ' + this.getUsers[this.editedIndex]?.lastName : null
      return this.editedIndex !== -1 ? 'Editing user account of ' + fullName : undefined
    },
    deletingTitle() {
      return 'Delete user account ' + this.editedUser.email + '?'
    },
    firstNameErrors() {
      return validationRules(this.$v.editedUser.firstName, 'First Name', {})
    },
    lastNameErrors() {
      return validationRules(this.$v.editedUser.lastName, 'Last Name', {})
    },
    emailErrors() {
      return validationRules(this.$v.editedUser.email, 'Email', {})
    }
  },
  methods: {
    ...mapActions('notification', ['setSnackbar']),
    ...mapActions('account', ['getAll', 'update', 'delete']),
    onEditUser(item) {
      this.editedIndex = this.getUsers.indexOf(item)
      this.editedUser = Object.assign({}, item)
      setTimeout(() => this.$refs.firstName.focus(), 0)
      this.isEditing = true
    },
    onDeleteUser(item) {
      this.editedIndex = this.getUsers.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.isDeleting = true
    },
    onDeleteUserConfirm() {
      this.loading = true
      this.delete(this.editedUser.id).then(response => {
        console.log(response)
        this.onClose()
        if (!this.getUserValue) {
          this.$router.push({ name: 'Login' }).then(() => {
            this.setSnackbar({ color: 'success', text: response.data.message })
          })
        }
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      }).finally(() => this.loading = false)
    },
    onClose() {
      this.isCreating = this.isEditing = this.isDeleting = false
      this.$v.$reset()
      this.$nextTick(() => {
        this.editedUser = Object.assign({})
        this.editedIndex = -1
      })
    },
    onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.update(this.editedUser).then(response => {
          console.log(response)
          this.setSnackbar({ color: 'success', text: response.data.message })
          this.onClose()
        }).catch(error => {
          console.log(error.response)
          this.setSnackbar({ color: 'error', text: error.response.data.message })
        }).finally(() => this.loading = false)
      }
    },
    onSearch() {
      this.isSearching = !this.isSearching
      if (!this.isSearching && !this.search.length) setTimeout(() => this.$refs.search.blur(), 0)
    },
  },
}
</script>
