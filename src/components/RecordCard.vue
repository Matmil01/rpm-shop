<template>
  <div class="rounded p-4 w-full mx-auto bg-gradient-to-b from-MyDark to-gray-800 font-main text-MyWhite">
    <router-link
      :to="`/record/${props.id}`"
      class="block"
    >
      <div class="relative group">

        <img
          src="/vinyl_PNG18.png"
          alt=""
          loading="lazy"
          class="absolute inset-0 w-full h-full z-0 opacity-80 transition-all duration-300
            group-hover:translate-x-6 group-hover:animate-spin"
          style="object-fit: contain;"
        />

        <img
          :src="props.coverImage"
          alt="Album Cover"
          loading="lazy"
          class="w-full aspect-square object-cover mb-2 rounded relative z-10 transition-all duration-300
            group-hover:-translate-x-6"
        />
      </div>
    </router-link>
    <div
      class="text-lg font-bold text-left block mb-1"
    >
      {{ props.album }}
    </div>
    <router-link
      :to="`/shop?search=${encodeURIComponent(props.artist)}`"
      class="text-MyWhite underline text-left inline mb-2 hover:opacity-70 transition-opacity"
    >
      {{ props.artist }}
    </router-link>

    <div class="flex items-center justify-start mt-4">
      <AddToCartButton v-if="props.stock > 0" :item="{
        id: props.id,
        album: props.album,
        artist: props.artist,
        coverImage: props.coverImage,
        price: props.price,
        discount: props.discount
      }" />
      <div v-else class="px-6 py-3 bg-MyDark text-MyWhite rounded opacity-75 cursor-not-allowed">
        Out of Stock
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import AddToCartButton from '@/components/AddToCartButton.vue'

const props = defineProps({
  id: String,
  album: String,
  artist: String,
  coverImage: String,
  price: [Number, String],
  discount: { type: [Number, String], default: 0 },
  stock: { type: [Number, String], default: 1 }
})

const { calculateDiscountedPrice } = usePriceCalculator()

const discountedPrice = computed(() =>
  calculateDiscountedPrice(props.price, props.discount)
)

const cart = useCartStore()
</script>
