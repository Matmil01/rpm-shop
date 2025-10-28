<template>
  <!-- Dropdown for selecting order status in admin dashboard-->
  <select
    :value="modelValue"
    @change="onChange"
    class="bg-MyBlack border border-MyYellow rounded text-MyWhite font-main px-2 py-1 cursor-pointer max-w-[130px]"
  >
    <!-- Render each status option -->
    <option
      v-for="opt in statusOptions"
      :key="opt.value"
      :value="opt.value"
      class="font-main"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
import { useOrderStatus } from '@/composables/admin/useOrderStatus'

// Props: modelValue is the current selected status
const props = defineProps({
  modelValue: { type: String, required: true }
})

// Emits: update:modelValue when the selection changes
const emit = defineEmits(['update:modelValue'])

// Get status options from composable
const { statusOptions } = useOrderStatus()

// When the dropdown value changes, emit the new value to parent
function onChange(e) {
  emit('update:modelValue', e.target.value)
}
</script>
