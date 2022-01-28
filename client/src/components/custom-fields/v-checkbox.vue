<template>
  <div class="form-check">
    <input
        v-if="isArray"
        type="checkbox"
        class="form-check-input"
        :class="{ 'is-invalid': errors.length >= 1, 'is-valid': isValidData }"
        :id="uuid"
        :checked="modelValue"
        @change="e => onChange(e.target.value)"
    />
    <input
        v-else
        type="checkbox"
        class="form-check-input"
        :class="{ 'is-invalid': errors.length >= 1, 'is-valid': isValidData }"
        :id="uuid"
        :value="value"
        :checked="value"
        @change="$emit('update:modelValue', $event.target.checked)"
    />
    <label
        v-if="label"
        :for="uuid"
        class="mb-1"
        :class="{ 'is-invalid': errors.length >= 1, 'is-valid': isValidData }"
    >{{ label }}</label>
    <div v-if="errors.length" class="invalid-feedback d-block mb-2">
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
  name: "VCheckbox",
  props: {
    isArray: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    modelValue: {
      type: [Array, String, Boolean],
      default: null
    },
    isValidData: {
      type: Boolean,
      default: false
    },
    errors: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const uuid = uuidv4()

    return {
      uuid,
    }
  },
  methods: {
    onChange(value) {
      if (this.modelValue.includes(this.value)) {
        this.$emit('update:modelValue', this.modelValue.filter(cv => cv !== value))
      }
      else {
        this.$emit('update:modelValue', this.modelValue.concat(value))
      }
    }
  }
});
</script>

<style>
label.is-valid {
  color: #198754
}
label.is-invalid {
  color: #dc3545
}
</style>
