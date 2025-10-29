<template>
  <!-- Link mode: renders a <router-link> if 'to' prop is provided -->
  <router-link v-if="to" :to="to" :class="[
    'font-main text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow inline-flex items-center justify-center',
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
  ]" :aria-disabled="disabled ? 'true' : null" @click="handleClick">
    <slot />
  </router-link>

  <!-- Button mode: renders a <button> if 'to' prop is not provided -->
  <button v-else :type="type" :disabled="disabled" :class="[
    'font-main text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow inline-flex items-center justify-center',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  ]" @click="handleClick">
    <slot />
  </button>
</template>

<script setup>
// Props:
// - to: if provided, renders as a <router-link> for navigation
// - onClick: optional callback for click events
// - type: button type (default 'button')
// - disabled: disables the button/link
const props = defineProps({
  to: { type: [String, Object], default: null },
  onClick: { type: Function, default: null }, // compatibility
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})
// Emits 'click' event for parent listeners
const emit = defineEmits(['click'])

// Handles click events for both button and link modes
function handleClick(e) {
  if (props.disabled) {
    // Prevent action if disabled
    e.preventDefault()
    e.stopPropagation()
    return
  }
  emit('click', e)            // supports @click on the component
  if (props.onClick) props.onClick(e) // supports :onClick prop
}
</script>
