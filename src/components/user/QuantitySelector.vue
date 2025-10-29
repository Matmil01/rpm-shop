<template>
  <!-- Quantity selector for cart -->
  <div class="flex items-center">
    <button @click="decrement"
      class="w-6 h-6 bg-gray-700 text-MyWhite rounded-l flex items-center justify-center hover:opacity-70 transition ease-in-out duration-200 cursor-pointer"
      :disabled="modelValue <= min">
      -
    </button>
    <!-- Display current quantity -->
    <div class="px-2 py-1 bg-gray-800 text-center text-xs w-8">
      {{ modelValue }}
    </div>
    <!-- Increment button: increases quantity -->
    <button @click="increment"
      class="w-6 h-6 bg-gray-700 text-MyWhite rounded-r flex items-center justify-center hover:opacity-70 transition ease-in-out duration-200 cursor-pointer">
      +
    </button>
  </div>
</template>

<script setup>
// Props:
// - modelValue: current quantity (v-model)
// - min: minimum allowed value (default 1)
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 }
})

// Emits 'update:modelValue' when quantity changes
const emit = defineEmits(['update:modelValue'])

// Increases quantity by 1
function increment() {
  emit('update:modelValue', props.modelValue + 1)
}

// Decreases quantity by 1, but not below min
function decrement() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>
