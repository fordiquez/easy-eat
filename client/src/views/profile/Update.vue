<!--<template>-->
<!--  <div>-->
<!--    <h1 class="text-center mb-4 mt-3">Update Profile</h1>-->
<!--    <form class="card" @submit.prevent="onSubmit">-->
<!--      <div class="card-body">-->
<!--        <v-input-->
<!--            type="text"-->
<!--            label="First Name"-->
<!--            v-model="v$.user.firstName.$model"-->
<!--            :errors="v$.user.firstName.$errors"-->
<!--            :isValidData="!v$.user.firstName.$invalid">-->
<!--        </v-input>-->
<!--        <v-input-->
<!--            type="text"-->
<!--            label='Last Name'-->
<!--            v-model="v$.user.lastName.$model"-->
<!--            :errors="v$.user.lastName.$errors"-->
<!--            :isValidData="!v$.user.lastName.$invalid">-->
<!--        </v-input>-->
<!--        <v-input-->
<!--            type="email"-->
<!--            label="Email"-->
<!--            v-model="v$.user.email.$model"-->
<!--            :errors="v$.user.email.$errors"-->
<!--            :isValidData="!v$.user.email.$invalid">-->
<!--        </v-input>-->
<!--        <v-input-->
<!--            type="password"-->
<!--            label="Create your password"-->
<!--            v-model="v$.user.password.$model"-->
<!--            :errors="v$.user.password.$errors"-->
<!--            :isValidData="!v$.user.password.$invalid">-->
<!--        </v-input>-->
<!--        <v-input-->
<!--            type="password"-->
<!--            label="Confirm your password"-->
<!--            v-model="v$.user.passwordConfirm.$model"-->
<!--            :errors="v$.user.passwordConfirm.$errors"-->
<!--            :isValidData="!v$.user.passwordConfirm.$invalid">-->
<!--        </v-input>-->
<!--        <div class="d-flex justify-content-start">-->
<!--          <button type="submit" class="btn btn-primary" :disabled="v$.$invalid || status.loading">-->
<!--            <span v-if="!status.loading">Save</span>-->
<!--            <span v-if="status.loading">-->
<!--            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>-->
<!--            Loading...-->
<!--          </span>-->
<!--          </button>-->
<!--          <router-link :to="{ name: 'Profile' }" class="btn btn-outline-primary ms-3">Go back</router-link>-->
<!--        </div>-->
<!--      </div>-->
<!--    </form>-->

<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import VInput from "@/components/custom-fields/v-input";-->
<!--import useVuelidate from "@vuelidate/core";-->
<!--import {email, utils, minLength, required, sameAs} from "@vuelidate/validators";-->
<!--import {mapActions, mapGetters, mapState} from "vuex";-->
<!--import VRadio from "@/components/custom-fields/v-radio";-->

<!--export default {-->
<!--  name: "ProfileUpdate",-->
<!--  components: {-->
<!--    VRadio,-->
<!--    VInput,-->
<!--  },-->
<!--  setup() {-->
<!--    return { v$: useVuelidate() };-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      user: {-->
<!--        password: null,-->
<!--        passwordConfirm: null-->
<!--      }-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    const { id } = this.getUserValue-->
<!--    this.getUser(id)-->
<!--  },-->
<!--  validations() {-->
<!--    return {-->
<!--      user: {-->
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
<!--          minLength: utils.withMessage('Password must have at least 6 characters', minLength(6))-->
<!--        },-->
<!--        passwordConfirm: {-->
<!--          sameAs: utils.withMessage('The entered passwords do not match', sameAs(this.user.password))-->
<!--        },-->
<!--      },-->
<!--    };-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState('account', ['status', 'response']),-->
<!--    ...mapGetters('account', ['getUserValue'])-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions({-->
<!--      getById: 'account/getById',-->
<!--      update: 'account/update',-->
<!--      success: 'alert/success',-->
<!--      error: 'alert/error'-->
<!--    }),-->
<!--    async onSubmit() {-->
<!--      const validated = await this.v$.$validate()-->
<!--      if (validated) {-->
<!--        console.table(this.user)-->
<!--        await this.update(this.user).then(async res => {-->
<!--          console.log(res)-->
<!--          if (this.status.success) {-->
<!--            await this.success(this.response)-->
<!--          } else {-->
<!--            await this.error(this.response)-->
<!--          }-->
<!--        }).catch(error => {-->
<!--          console.log(error)-->
<!--        })-->
<!--      }-->
<!--    },-->
<!--    async getUser(id) {-->
<!--      await this.getById(id).then(res => {-->
<!--        console.log(res)-->
<!--        this.user = res.data-->
<!--      }).catch(error => {-->
<!--        console.log(error)-->
<!--      })-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
