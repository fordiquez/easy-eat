<template>
  <div class="form-check form-check-inline">
    <input
        type="radio"
        class="form-check-input"
        :id="uuid"
        :value="value"
        @change="$emit('update:modelValue', $event.target.value)"
        :checked="value === modelValue"
    />
    <label v-if="label" :for="uuid" class="mb-1">{{ label }}</label>
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
      default: null,
    },
    value: {
      type: String,
      default: null
    },
    modelValue: {
      type: String,
      default: null
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
