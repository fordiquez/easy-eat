<template>
  <div class="form-group">
    <label v-if="label" :for="uuid" class="mb-1">{{ label }}</label>
    <input
        :type="type"
        class="form-control mb-2"
        :class="{ 'is-invalid': errors.length >= 1, 'is-valid': isValidData }"
        :placeholder="label"
        :id="uuid"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="errors.length" class="invalid-feedback mb-2">
      <span v-for="(error, index) in errors" :key="`error-${label}-${index}`" class="d-block">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: "VInput",
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: null,
    },
    isValidData: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [String, Number],
      default: null,
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
