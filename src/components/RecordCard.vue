<template>
  <div class="rounded p-4 shadow-lg hover:shadow-2xl w-full mx-auto bg-[url('/Texturelabs_InkPaint_368XL.jpg')] bg-cover bg-center transition-shadow font-main text-MyWhite">
    <router-link
      :to="`/product/${props.id}`"
      class="block"
    >
      <img
        :src="props.coverImage"
        alt="Album Cover"
        class="w-full aspect-square object-cover mb-2 rounded shadow-xl group-hover:opacity-90"
      />
    </router-link>
    <router-link
      :to="`/product/${props.id}`"
      class="text-lg font-bold text-left block hover:underline mb-1"
    >
      {{ props.album }}
    </router-link>
    <router-link
      :to="`/shop?search=${encodeURIComponent(props.artist)}`"
      class="text-MyWhite underline hover:text-blue-400 text-left block mb-2"
    >
      {{ props.artist }}
    </router-link>
    <!-- Price and Cart Box aligned left -->
    <div class="flex items-center justify-start mt-4">
      <AddToCartButton :item="{
        id: props.id,
        album: props.album,
        artist: props.artist,
        coverImage: props.coverImage,
        price: props.price,
        discount: props.discount
      }" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import AddToCartButton from '@/components/AddToCartButton.vue'

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

const cart = useCartStore()
</script>
