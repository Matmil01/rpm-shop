<template>
  <div class="flex items-center">
    <button
      @click="decrement"
      class="w-6 h-6 bg-gray-700 text-MyWhite rounded-l flex items-center justify-center hover:opacity-70 transition ease-in-out duration-200 cursor-pointer"
      :disabled="modelValue <= min"
    >
      -
    </button>
    <div class="px-2 py-1 bg-gray-800 text-center text-xs w-8">
      {{ modelValue }}
    </div>
    <button
      @click="increment"
      class="w-6 h-6 bg-gray-700 text-MyWhite rounded-r flex items-center justify-center hover:opacity-70 transition ease-in-out duration-200 cursor-pointer"
    >
      +
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 }
})
const emit = defineEmits(['update:modelValue'])

function increment() {
  emit('update:modelValue', props.modelValue + 1)
}
function decrement() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>
