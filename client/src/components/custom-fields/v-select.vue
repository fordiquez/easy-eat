<template>
  <div class="form-group">
    <label class="mb-1">{{ label }}</label>
    <select
        class="form-select"
        :class="{ 'is-invalid': errors.length >= 1, 'is-valid': isValidData }"
        @change="changeHandler"
        @bind="$attrs"
        :value="$attrs.modelValue">
      <option value="">Please Select</option>
      <option
          v-for="(option, index) in options"
          :key="label + index"
          :value="option"
          :selected="option === $attrs.modelValue"
      >
        {{ option }}
      </option>
    </select>
    <div v-if="errors.length" class="invalid-feedback mb-2">
      <span v-for="(error, index) in errors" :key="`error-${label}-${index}`">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "VSelect",
  props: {
    label: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: Array,
      default: () => [],
    },
    isValidData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedValue: "",
    };
  },
  methods: {
    changeHandler(event) {
      const value = event.target.value;
      this.$emit("update:modelValue", value);
    },
  },
});
</script>
