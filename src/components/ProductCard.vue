<template>
  <router-link
    :to="`/product/${id}`"
    class="block border rounded p-4 hover:shadow w-full mx-auto bg-white transition-shadow cursor-pointer group"
  >
    <img :src="image" alt="" class="w-full aspect-square object-cover mb-2 rounded group-hover:opacity-90" />
    <h2 class="text-lg font-bold text-left">{{ title }}</h2>
    <p class="text-gray-500 text-left mb-2">{{ price }} USD</p>
    <span class="text-blue-500 hover:underline block text-left">View Details</span>
  </router-link>
</template>

<script setup>
defineProps({
  id: Number,
  title: String,
  image: String,
  price: Number
})
</script>
