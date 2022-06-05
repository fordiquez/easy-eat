<template>
  <v-card>
    <v-data-table
        v-if="getUsers"
        :headers="headers"
        :items="getUsers"
        :items-per-page="10"
        :search="search"
        :loading="!getUsers.length"
        loading-text="Users is loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              color="success"
              label="Search"
              placeholder="Please enter at least 1 character of the user account email address"
              ref="search"
              @keydown.esc="onSearch"
              @click="onSearch"
              full-width
          />
          <v-btn class="ml-3" color="success" @click="isCreating = true" dark>New Item</v-btn>
        </v-toolbar>
        <create-user v-if="isCreating" :is-creating="isCreating" @close-dialog="onClose" />
        <v-dialog v-model="isEditing" max-width="700px">
          <v-card flat :loading="loading">
            <v-card-title>
              <span class="text-h5">{{ editingTitle }}</span>
            </v-card-title>
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
                      <v-radio-group v-model="editedUser.role" :error-messages="roleErrors" prepend-icon="mdi-account-multiple" dense row>
                        <span class="mr-2">User role</span>
                        <v-radio label="User" value="User" @change="$v.editedUser.role.$touch()"></v-radio>
                        <v-radio label="Admin" value="Admin" @change="$v.editedUser.role.$touch()"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="onClose">Cancel</v-btn>
                <v-btn color="blue darken-1" text type="submit" :disabled="($v.$invalid && $v.$error) || loading" :loading="loading">Save</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isDeleting" max-width="700px">
          <v-card>
            <v-card-title class="text-h5">{{ deletingTitle }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="onCloseDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="onDeleteUserConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom color="green accent-3">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small class="mr-2" color="green accent-3" v-bind="attrs" v-on="on" @click="onEditUser(item)">mdi-pencil</v-icon>
          </template>
          <span>Edit user account</span>
        </v-tooltip>
        <v-tooltip bottom color="red">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="red" v-bind="attrs" v-on="on" @click="onDeleteUser(item)">mdi-delete</v-icon>
          </template>
          <span>Delete user account</span>
        </v-tooltip>
        <v-tooltip bottom color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" :to="{ name: 'UserEdit', params: { id: item.id } }" icon>
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </template>
          <span>View detailed info</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getAll">Reset</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { alpha, email, minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { emailErrors, firstNameErrors, lastNameErrors, roleErrors } from "@/utils/validations";
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
  async created() {
    setTimeout(async () => await this.getAll(), 1000)
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
    ...mapGetters('account', ['getUsers']),
    editingTitle() {
      return 'Editing user account of ' + this.editedUser.firstName + ' ' + this.editedUser.lastName
    },
    deletingTitle() {
      return 'Are you really want to delete user account ' + this.editedUser.email + '?'
    },
    firstNameErrors() {
      return firstNameErrors(this.$v.editedUser.firstName)
    },
    lastNameErrors() {
      return lastNameErrors(this.$v.editedUser.lastName)
    },
    emailErrors() {
      return emailErrors(this.$v.editedUser.email)
    },
    roleErrors() {
      return roleErrors(this.$v.editedUser.role)
    }
  },
  methods: {
    ...mapActions({
      getAll: 'account/getAll',
      update: 'account/update',
      delete: 'account/delete',
      setSnackbar: 'notification/setSnackbar'
    }),
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
      this.delete(this.editedUser.id).then(async response => {
        console.log(response)
        this.onCloseDelete()
        !this.user ? await this.$router.push({ name: 'Login' }) : null
        await this.setSnackbar({ color: 'success', text: response.data.message })
      }).catch(error => {
        console.log(error.response)
        this.setSnackbar({ color: 'error', text: error.response.data.message })
      })
    },
    onClose() {
      this.isCreating = this.isEditing = false
      this.$v.$reset()
      this.$nextTick(() => {
        this.editedUser = Object.assign({})
        this.editedIndex = -1
      })
    },
    onCloseDelete() {
      this.isDeleting = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({})
        this.editedIndex = -1
      })
    },
    async onSubmit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        await this.update(this.editedUser).then(response => {
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
      !this.isSearching && !this.search.length ? setTimeout(() => this.$refs.search.blur(), 0) : null
    },
  },
}
</script>
