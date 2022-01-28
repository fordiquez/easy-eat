<template>
  <h1 class="text-center mb-4">Register</h1>
  <div class="row">
    <div class="col-8">
      <RegisterForm @formData="formData = $event" />
    </div>
    <div class="col-4">
      <div class="card create-employee">
        <div class="card-body">
          <p class="text-center">
            Here we are using Vue 3 with vuelidate for the validation
          </p>
          <pre class="mb-0">{{ formData }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import RegisterForm from "@/components/account/register-form";

export default defineComponent({
  name: "Register",
  components: {
    RegisterForm,
  },
  data() {
    return {
      formData: null,
    };
  },
  computed: {
    ...mapState('account', ['status'])
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),
  }
});
</script>
