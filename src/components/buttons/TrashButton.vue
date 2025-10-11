<template>
  <img
    src="/icons/trashIcon.svg"
    :alt="alt"
    :title="title"
    class="w-6 h-6 cursor-pointer hover:opacity-70 transition duration-200 ease-in-out inline-block"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    @click="handleClick"
  />
</template>

<script setup>
const props = defineProps({
  disabled: Boolean,
  title: { type: String, default: 'Delete' },
  alt: { type: String, default: 'Delete' }
})
const emit = defineEmits(['click'])

function handleClick(event) {
  if (!props.disabled) emit('click', event)
}
</script>
