<template>
  <div class="rounded p-4 w-full mx-auto font-main text-MyWhite">
    <!-- Link to record details page -->
    <router-link :to="`/record/${props.id}`" class="block">
      <div class="relative group">

        <img src="/vinyl_PNG18.webp" alt="" loading="lazy" class="absolute inset-0 w-full h-full z-0 opacity-100 transition-all duration-300
            group-hover:translate-x-6 group-hover:animate-spin" style="object-fit: contain;" />

        <img :src="props.coverImage" alt="Album Cover" loading="lazy" class="w-full aspect-square object-cover mb-2 rounded relative z-10 transition-all duration-300
            group-hover:-translate-x-6 shadow-MyBlack shadow" />
      </div>
    </router-link>
    <!-- Album title -->
    <div class="text-lg font-bold w-full block mb-1 overflow-hidden whitespace-nowrap truncate">
      {{ props.album }}
    </div>
    <!-- Link to artist search -->
    <router-link :to="`/shop?search=${encodeURIComponent(props.artist)}`"
      class="text-MyWhite underline text-left inline mb-2 hover:opacity-70 transition duration-200 ease-in-out">
      {{ props.artist }}
    </router-link>

    <!-- Add to Cart or Out of Stock button -->
    <div class="flex items-center justify-center mt-4">
      <AddToCartButton v-if="props.stock > 0" :item="{
        id: props.id,
        album: props.album,
        artist: props.artist,
        coverImage: props.coverImage,
        price: props.price,
        discount: props.discount
      }" @added="props.showSnackbar && props.showSnackbar('Added to cart!')" />
      <OutOfStock v-else />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import AddToCartButton from '@/components/buttons/AddToCartButton.vue'
import OutOfStock from '@/components/buttons/OutOfStock.vue'

// Props:
// - id, album, artist, coverImage, price, discount, stock: record info
// - showSnackbar: function to show snackbar notification
const props = defineProps({
  id: String,
  album: String,
  artist: String,
  coverImage: String,
  price: [Number, String],
  discount: { type: [Number, String], default: 0 },
  stock: { type: [Number, String], default: 1 },
  showSnackbar: Function
})

// Price calculation for discounted price display
const { calculateDiscountedPrice } = usePriceCalculator()

const discountedPrice = computed(() =>
  calculateDiscountedPrice(props.price, props.discount)
)

// Access cart store (not used directly here, but available for future logic)
const cart = useCartStore()
</script>
