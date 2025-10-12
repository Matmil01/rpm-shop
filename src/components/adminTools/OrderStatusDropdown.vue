<template>
  <select
    :value="modelValue"
    @change="onChange"
    class="bg-MyBlack border border-MyYellow rounded text-MyWhite font-main px-2 py-1 cursor-pointer max-w-[130px]"
  >
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
import { useOrderStatus } from '@/composables/useOrderStatus'

const props = defineProps({
  modelValue: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue'])

const { statusOptions } = useOrderStatus()

function onChange(e) {
  emit('update:modelValue', e.target.value)
}
</script>
