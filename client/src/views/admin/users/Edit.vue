<template>
  <div>Editing user page of account {{ user.email }}</div>
</template>

<script>
export default {
  name: "UserEdit",
  props: {
    user: {
      type: Object,
      default: null
    }
  }
}
</script>

