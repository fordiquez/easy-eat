<!--<template>-->
<!--  <section class="daily-log__section">-->
<!--    <div class="daily-log__meal-card">-->
<!--      <div class="meal-card" data-type="breakfast">-->

<!--      </div>-->
<!--    </div>-->
<!--  </section>-->
<!--  <input type="text" v-model="query">-->
<!--  <button class="btn btn-success btn-sm" @click="nutritionAnalysis">Submit</button>-->
<!--</template>-->

<!--<script>-->
<!--import { mapActions } from "vuex";-->

<!--export default {-->
<!--  name: "DailyLog",-->
<!--  data() {-->
<!--    return {-->
<!--      query: ''-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions({-->
<!--      logout: 'account/logout',-->
<!--      search: 'product/search'-->
<!--    }),-->
<!--    async onLogout() {-->
<!--      await this.logout().then(async () => {-->
<!--        await this.$router.push({ name: 'Login' });-->
<!--      })-->
<!--    },-->
<!--    async nutritionAnalysis() {-->
<!--      const options = {-->
<!--        params: {-->
<!--          ingr: this.query-->
<!--        }-->
<!--      }-->
<!--      await this.search(options).then(response => {-->
<!--        console.log(response)-->
<!--      }).catch(error => {-->
<!--        console.log(error)-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
