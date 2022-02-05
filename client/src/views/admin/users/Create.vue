<!--<template>-->
<!--  <h1 class="text-center mb-4 mt-3">Create a new user account</h1>-->
<!--  <form class="card" @submit.prevent="onSubmit">-->
<!--    <div class="card-body">-->
<!--      <v-input-->
<!--          type="text"-->
<!--          label="First Name"-->
<!--          v-model="v$.formData.firstName.$model"-->
<!--          :errors="v$.formData.firstName.$errors"-->
<!--          :isValidData="!v$.formData.firstName.$invalid">-->
<!--      </v-input>-->
<!--      <v-input-->
<!--          type="text"-->
<!--          label='Last Name'-->
<!--          v-model="v$.formData.lastName.$model"-->
<!--          :errors="v$.formData.lastName.$errors"-->
<!--          :isValidData="!v$.formData.lastName.$invalid">-->
<!--      </v-input>-->
<!--      <v-input-->
<!--          type="email"-->
<!--          label="Email"-->
<!--          v-model="v$.formData.email.$model"-->
<!--          :errors="v$.formData.email.$errors"-->
<!--          :isValidData="!v$.formData.email.$invalid">-->
<!--      </v-input>-->
<!--      <label class="me-2">Account role</label>-->
<!--      <v-radio-->
<!--          label="User"-->
<!--          value="User"-->
<!--          v-model="v$.formData.role.$model"-->
<!--          :errors="v$.formData.role.$errors"-->
<!--          :isValidData="!v$.formData.role.$invalid">-->
<!--      </v-radio>-->
<!--      <v-radio-->
<!--          label="Admin"-->
<!--          value="Admin"-->
<!--          v-model="v$.formData.role.$model"-->
<!--          :errors="v$.formData.role.$errors"-->
<!--          :isValidData="!v$.formData.role.$invalid">-->
<!--      </v-radio>-->
<!--      <v-input-->
<!--          type="password"-->
<!--          label="Create your password"-->
<!--          v-model="v$.formData.password.$model"-->
<!--          :errors="v$.formData.password.$errors"-->
<!--          :isValidData="!v$.formData.password.$invalid">-->
<!--      </v-input>-->
<!--      <v-input-->
<!--          type="password"-->
<!--          label="Confirm your password"-->
<!--          v-model="v$.formData.passwordConfirm.$model"-->
<!--          :errors="v$.formData.passwordConfirm.$errors"-->
<!--          :isValidData="!v$.formData.passwordConfirm.$invalid">-->
<!--      </v-input>-->
<!--      <div class="d-flex justify-content-start">-->
<!--        <button type="submit" class="btn btn-primary" :disabled="v$.$invalid || status.loading">-->
<!--          <span v-if="!status.loading">Save</span>-->
<!--          <span v-if="status.loading">-->
<!--            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>-->
<!--            Loading...-->
<!--          </span>-->
<!--        </button>-->
<!--        <router-link :to="{ name: 'UsersList' }" class="btn btn-outline-primary ms-3">Go back</router-link>-->
<!--      </div>-->
<!--    </div>-->
<!--  </form>-->
<!--</template>-->

<!--<script>-->
<!--import VInput from "@/components/custom-fields/v-input";-->
<!--import useVuelidate from "@vuelidate/core";-->
<!--import { email, utils, required, sameAs } from "@vuelidate/validators";-->
<!--import {mapActions, mapState} from "vuex";-->
<!--import VRadio from "@/components/custom-fields/v-radio";-->

<!--export default {-->
<!--  name: "UserCreate",-->
<!--  components: {-->
<!--    VRadio,-->
<!--    VInput,-->
<!--  },-->
<!--  setup() {-->
<!--    return { v$: useVuelidate() };-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      formData: {-->
<!--        firstName: '',-->
<!--        lastName: '',-->
<!--        email: '',-->
<!--        password: '',-->
<!--        passwordConfirm: '',-->
<!--        role: 'User'-->
<!--      },-->
<!--    };-->
<!--  },-->
<!--  validations() {-->
<!--    return {-->
<!--      formData: {-->
<!--        firstName: {-->
<!--          required: utils.withMessage('This field cannot be empty', required)-->
<!--        },-->
<!--        lastName: {-->
<!--          required: utils.withMessage('This field cannot be empty', required)-->
<!--        },-->
<!--        email: {-->
<!--          required: utils.withMessage('This field cannot be empty', required),-->
<!--          email: utils.withMessage('This field has an invalid email address', email)-->
<!--        },-->
<!--        password: {-->
<!--          required: utils.withMessage('This field cannot be empty', required)-->
<!--        },-->
<!--        passwordConfirm: {-->
<!--          required: utils.withMessage('This field cannot be empty', required),-->
<!--          sameAs: utils.withMessage('The entered passwords do not match', sameAs(this.formData.password))-->
<!--        },-->
<!--        role: {-->
<!--          required: utils.withMessage('This field must be selected', required)-->
<!--        }-->
<!--      },-->
<!--    };-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState('account', ['status', 'response'])-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions({-->
<!--      create: 'account/create',-->
<!--      success: 'alert/success',-->
<!--      error: 'alert/error'-->
<!--    }),-->
<!--    async onSubmit() {-->
<!--      const validated = await this.v$.$validate()-->
<!--      if (validated) {-->
<!--        console.table(this.formData)-->
<!--        await this.create(this.formData).then(async () => {-->
<!--          if (this.status.success) {-->
<!--            await this.$router.push({ name: 'UsersList' })-->
<!--            await this.success(this.response)-->
<!--          } else {-->
<!--            await this.error(this.response)-->
<!--          }-->
<!--        })-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
