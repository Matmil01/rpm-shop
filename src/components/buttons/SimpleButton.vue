<template>
  <!-- Link mode -->
  <router-link
    v-if="to"
    :to="to"
    :class="[
      'font-main text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow inline-flex items-center justify-center',
      disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
    ]"
    :aria-disabled="disabled ? 'true' : null"
    @click="handleClick"
  >
    <slot />
  </router-link>

  <!-- Button mode -->
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[
      'font-main text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow inline-flex items-center justify-center',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  to: { type: [String, Object], default: null },
  onClick: { type: Function, default: null }, // compatibility
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['click'])

function handleClick(e) {
  if (props.disabled) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  emit('click', e)            // supports @click on the component
  if (props.onClick) props.onClick(e) // supports :onClick prop
}
</script>
