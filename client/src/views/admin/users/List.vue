<!--<template>-->
<!--  <h2>Users</h2>-->
<!--  <p>All users from secure (admin only) api end point:</p>-->
<!--  <router-link :to="{ name: 'UserCreate' }" class="btn btn-success">Create a new user account</router-link>-->
<!--  <div class="d-flex justify-content-center" v-if="status.loading">-->
<!--    <div class="spinner-border" role="status">-->
<!--      <span class="visually-hidden">Loading...</span>-->
<!--    </div>-->
<!--  </div>-->
<!--  <div class="table-responsive" v-if="usersList">-->
<!--    <table class="table table-striped table-hover table-responsive">-->
<!--      <thead>-->
<!--      <tr>-->
<!--        <th scope="col" :style="{ width: '5%' }">#</th>-->
<!--        <th scope="col" :style="{ width: '25%' }">Name</th>-->
<!--        <th scope="col" :style="{ width: '25%' }">Email</th>-->
<!--        <th scope="col" :style="{ width: '10%' }">Role</th>-->
<!--        <th scope="col" :style="{ width: '10%' }"></th>-->
<!--      </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--      <tr v-for="(user, index) in usersList" :key="user.id">-->
<!--        <th scope="row">{{ index + 1 }}</th>-->
<!--        <td :style="{ whiteSpace: 'nowrap' }">{{ user.firstName }} {{ user.lastName }}</td>-->
<!--        <td>{{ user.email }}</td>-->
<!--        <td>{{ user.role }}</td>-->
<!--        <td :style="{ whiteSpace: 'nowrap' }">-->
<!--          <router-link :to="{ name: 'UserEdit', params: { id: user.id } }" class="btn btn-primary btn-sm">Edit</router-link>-->
<!--          <button class="btn btn-danger btn-sm ms-2" @click="deleteUser(user.id)">Delete</button>-->
<!--        </td>-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </table>-->
<!--  </div>-->
<!--  <div v-else>-->
<!--    Users not found-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import {mapActions, mapGetters, mapState} from "vuex";-->

<!--export default {-->
<!--  name: "UsersList",-->
<!--  data() {-->
<!--    return {-->
<!--      user: null,-->
<!--      usersList: null-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.getUser.subscribe(user => this.user = user)-->
<!--  },-->
<!--  mounted() {-->
<!--    this.loadUsers()-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState('account', ['users', 'status']),-->
<!--    ...mapGetters('account', ['getUser', 'getUsers'])-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions({-->
<!--      getAll: 'account/getAll',-->
<!--      delete: 'account/delete',-->
<!--      success: 'alert/success',-->
<!--      error: 'alert/error'-->
<!--    }),-->
<!--    async loadUsers() {-->
<!--      await this.getAll().then(res => {-->
<!--        console.log(res)-->
<!--        if (this.status.success) {-->
<!--          this.usersList = this.users-->
<!--        }-->
<!--      }).catch(error => {-->
<!--        console.log(error)-->
<!--      })-->
<!--    },-->
<!--    async deleteUser(id) {-->
<!--      await this.delete(id).then(async res => {-->
<!--        console.log(res)-->
<!--        await this.success(res.data)-->
<!--        this.user ? await this.loadUsers() : await this.$router.push({ name: 'Login' })-->
<!--      }).catch(async error => {-->
<!--        console.log(error)-->
<!--        await this.error(error.response)-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
