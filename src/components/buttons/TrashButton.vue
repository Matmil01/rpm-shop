<template>
  <img src="/icons/trashIcon.svg" :alt="alt" :title="title"
    class="w-6 h-6 cursor-pointer hover:opacity-70 transition duration-200 ease-in-out inline-block"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }" @click="handleClick" />
</template>

<script setup>
// Props:
// - disabled: disables the button and changes appearance
// - title: tooltip/title text for the icon
// - alt: alt text for accessibility
const props = defineProps({
  disabled: Boolean,
  title: { type: String, default: 'Delete' },
  alt: { type: String, default: 'Delete' }
})
// Emits 'click' event for parent listeners
const emit = defineEmits(['click'])

// Handles click event, only emits if not disabled
function handleClick(event) {
  if (!props.disabled) emit('click', event)
}
</script>
