<template>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="bootstrap" viewBox="0 0 118 94">
      <title>Bootstrap</title>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z"></path>
    </symbol>
  </svg>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <router-link :to="{ name: 'Home' }" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"/></svg>
        </router-link>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link aria-current="page" exact-active-class="active" active-class="active" :to="{ name: 'Home' }" class="nav-link px-2 text-secondary">Home</router-link>
          </li>
          <li>
            <router-link aria-current="page" exact-active-class="active" active-class="active" :to="{ name: 'Profile' }" class="nav-link px-2 text-secondary">Profile</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link aria-current="page" exact-active-class="active" active-class="active" :to="{ name: 'AdminIndex' }" class="nav-link px-2 text-secondary">Admin</router-link>
          </li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
          <input type="search" class="form-control form-control-dark" placeholder="Search..." aria-label="Search">
        </form>

        <div class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
          <router-link v-if="!user" :to="{ name: 'Login' }" class="btn btn-outline-light me-2">Login</router-link>
          <router-link v-if="!user" :to="{ name: 'Register' }" class="btn btn-outline-light">Sign-up</router-link>
        </div>

        <div v-if="user" class="dropdown text-end">
          <a href="#" class="d-block link-light text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
          </a>
          <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1">
            <li><button class="dropdown-item" href="#">New project...</button></li>
            <li><button class="dropdown-item" href="#">Settings</button></li>
            <li><router-link :to="{ name: 'Profile' }" class="dropdown-item">Profile</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="signOut">Sign out</button></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {Role} from "@/helpers/role";

export default {
  name: "Nav",
  props: {
    user: {
      type: [Object, Boolean],
      required: false
    }
  },
  computed: {
    ...mapState('account', ['status', 'response']),
    isAdmin() {
      return this.user && this.user.role === Role.Admin
    }
  },
  methods: {
    ...mapActions({
      logout: 'account/logout',
    }),
    async signOut() {
      await this.logout().then(async () => {
        await this.$router.push({name: 'Login'});
      })
    },
  }
}
</script>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, .1);
  border: solid rgba(0, 0, 0, .15);
  border-width: 1px 0;
  box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
}

.bi {
  vertical-align: -.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
