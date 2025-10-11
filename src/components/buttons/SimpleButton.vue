<template>
  <router-link
    v-if="to"
    :to="to"
    class="font-main cursor-pointer text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow"
  >
    <slot />
  </router-link>
  <button
    v-else
    :type="type"
    class="font-main cursor-pointer text-MyYellow border border-MyYellow px-4 py-2 rounded-full shadow transition duration-200 ease-in-out whitespace-nowrap hover:bg-MyYellow hover:text-MyBlack hover:border-MyYellow"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  to: String,
  onClick: Function,
  type: {
    type: String,
    default: 'button'
  }
})
</script>
