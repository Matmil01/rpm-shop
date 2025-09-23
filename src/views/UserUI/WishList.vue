<template>
  <div class="container mx-auto px-4 max-w-5xl p-8 text-MyWhite font-main">
    <h1 class="text-3xl font-bold mb-8 text-center">Your Wishlist</h1>
    <div v-if="loading" class="text-center text-lg text-MyWhite">Loading wishlist...</div>
    <div v-else-if="wishlist.items.length">
      <div
        v-for="item in wishlist.items"
        :key="item.id"
        class="flex flex-col md:flex-row items-center justify-between mb-6 p-6 rounded bg-MyBlack/40 gap-6 shadow"
      >
        <router-link
          :to="`/record/${item.id}`"
          class="w-32 h-32 block"
        >
          <img
            v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-32 h-32 object-cover rounded shadow hover:opacity-80 transition"
          />
          <div v-else class="w-32 h-32 flex items-center justify-center bg-MyDark text-xs rounded">
            No Image
          </div>
        </router-link>
        <div class="flex-1 flex flex-col md:ml-6">
          <div class="font-bold text-xl mb-1 truncate">
            {{ item.album }}
          </div>
          <router-link
            :to="`/shop?search=${encodeURIComponent(item.artist)}`"
            class="text-MyWhite underline text-base mb-2 truncate hover:opacity-70 transition-opacity"
          >
            {{ item.artist }}
          </router-link>
          <div class="text-base mb-2">
            <span v-if="item.discount && item.discount > 0">
              <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
              <span class="text-MyRed font-bold">{{ calculateDiscountedPrice(item.price, item.discount) }} kr.</span>
            </span>
            <span v-else>
              <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
            </span>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 md:ml-6">
          <AddToCartButton :item="item" />
          <button
            @click="wishlist.removeFromWishlist(item.id)"
            class="text-red-500 hover:text-red-400 hover:underline shrink-0 flex items-center cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-lg text-gray-400">Your wishlist is empty.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import AddToCartButton from '@/components/AddToCartButton.vue'
import { useWishlistStore } from '@/composables/piniaStores/wishlistStore'
import { useUserStore } from '@/composables/piniaStores/userStore'

const wishlist = useWishlistStore()
const userStore = useUserStore()
const { calculateDiscountedPrice } = usePriceCalculator()
const loading = ref(true)

async function tryLoadWishlist() {
  if (userStore.uid) {
    await wishlist.loadWishlist()
    loading.value = false
  }
}

onMounted(() => {
  console.log('Current UID:', userStore.uid)
  tryLoadWishlist()
})

watch(
  () => userStore.uid,
  async (newUid) => {
    if (newUid) {
      loading.value = true
      await wishlist.loadWishlist()
      loading.value = false
    }
  }
)
</script>
