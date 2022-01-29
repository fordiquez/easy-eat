<template>
  <div class="form-check form-check-inline">
    <input
        type="radio"
        class="form-check-input"
        :class="{ 'is-invalid': errors.length >= 1, 'is-valid': isValidData }"
        :id="uuid"
        :value="value"
        @change="$emit('update:modelValue', $event.target.value)"
        :checked="value === modelValue"
    />
    <label v-if="label" :for="uuid" class="form-check-label mb-1">{{ label }}</label>
    <div v-if="errors.length" class="invalid-feedback mb-2">
      <span v-for="(error, index) in errors" :key="`error-${label}-${index}`">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { v4 as uuidv4 } from 'uuid';
export default defineComponent({
  name: "VRadio",
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: null
    },
    isValidData: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const uuid = uuidv4()
    return {
      uuid
    }
  },
});
</script>
