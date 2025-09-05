<template>
  <router-link
    :to="`/product/${id}`"
    class="block rounded p-4 shadow-lg hover:shadow-2xl w-full mx-auto bg-white bg-[url('/Texturelabs_InkPaint_368XL.jpg')] bg-cover bg-center transition-shadow cursor-pointer group font-main text-MyWhite"
  >
    <img :src="coverImage" alt="Album Cover" class="w-full aspect-square object-cover mb-2 rounded group-hover:opacity-90" />
    <h2 class="text-lg font-bold text-left">{{ album }}</h2>
    <div class="text-left mb-2">
      <router-link
        :to="`/shop?search=${encodeURIComponent(artist)}`"
        class="text-MyWhite underline hover:text-blue-400"
        @click.stop
      >
        {{ artist }}
      </router-link>
    </div>
    <div class="text-left mb-2">
      <span v-if="discount && discount > 0">
        <span class="line-through text-gray-400 mr-2">{{ price }} kr.</span>
        <span class="text-red-600 font-bold">{{ discountedPrice }} kr.</span>
      </span>
      <span v-else>
        <span class="text-gray-500">{{ price }} kr.</span>
      </span>
    </div>
    <span class="text-MyWhite underline hover:text-blue-400 block text-left cursor-pointer">Add to Cart 🛒</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: String,
  album: String,
  artist: String,
  coverImage: String,
  price: [Number, String],
  discount: { type: [Number, String], default: 0 }
})

const discountedPrice = computed(() => {
  if (!props.discount || props.discount <= 0) return props.price
  return Math.round(props.price * (1 - props.discount / 100))
})
</script>
