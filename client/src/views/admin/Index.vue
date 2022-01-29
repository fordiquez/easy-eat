<template>
  <h2>Admin</h2>
  <p>This section can only be accessed by administrators.</p>
  <router-link :to="{ name: 'UsersList' }" class="btn btn-primary">Manage Users</router-link>
</template>

<script>
export default {
  name: "Admin"
}
</script>

<style scoped>

</style>
