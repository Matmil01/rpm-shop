<template>
  <Snackbar :message="snackbarMessage" :show="snackbarShow" />
  <div class="container mx-auto px-4 max-w-5xl p-8 text-MyWhite font-main">
    <h1 class="text-3xl font-bold mb-8 text-center font-headline">Your Wishlist</h1>
    <div v-if="loading" class="text-center text-lg text-MyWhite">Loading wishlist...</div>
    <div v-else-if="wishlist.items.length">
      <div v-for="item in wishlist.items" :key="item.id"
        class="flex flex-col md:flex-row items-center justify-between mb-6 p-6 rounded-3xl bg-MyDark gap-6 shadow shadow-MyYellow">
        <router-link :to="`/record/${item.id}`" class="w-32 h-32 block">
          <img v-if="item.coverImage" :src="item.coverImage" alt="Cover"
            class="w-32 h-32 object-cover rounded shadow hover:opacity-80 transition" />
          <div v-else class="w-32 h-32 flex items-center justify-center bg-MyDark text-xs rounded">
            No Image
          </div>
        </router-link>
        <div class="flex-1 flex flex-col md:ml-6">
          <div class="font-bold text-xl mb-1 truncate">
            {{ item.album }}
          </div>
          <router-link :to="`/shop?search=${encodeURIComponent(item.artist)}`"
            class="text-MyWhite underline text-base mb-2 truncate hover:opacity-70 transition-opacity">
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
        <div class="flex flex-row items-center gap-2 md:ml-6">
          <AddToCartButton :item="item" @added="showSnackbar('Added to cart!')" />
          <TrashButton title="Remove from wishlist" alt="Remove" class="shrink-0 flex items-center" :disabled="false"
            @click="wishlist.removeFromWishlist(item.id)" />
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
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import { useWishlistStore } from '@/composables/piniaStores/wishlistStore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import AddToCartButton from '@/components/buttons/AddToCartButton.vue'
import TrashButton from '@/components/buttons/TrashButton.vue'
import Snackbar from '@/components/Snackbar.vue'

// Snackbar message text
const snackbarMessage = ref('')
// Snackbar visibility state
const snackbarShow = ref(false)

// Helper to show snackbar notification
function showSnackbar(msg) {
  snackbarMessage.value = msg
  snackbarShow.value = true
  setTimeout(() => snackbarShow.value = false, 3000)
}

// Access wishlist store
const wishlist = useWishlistStore()
// Access user store
const userStore = useUserStore()
// Price calculation function
const { calculateDiscountedPrice } = usePriceCalculator()
// Loading state for wishlist
const loading = ref(true)

// Loads wishlist from Firestore if user is logged in
async function tryLoadWishlist() {
  if (userStore.uid) {
    await wishlist.loadWishlist()
    loading.value = false
  }
}

// On mount: load wishlist for current user
onMounted(() => {
  console.log('Current UID:', userStore.uid)
  tryLoadWishlist()
})

// Watch for changes to user UID and reload wishlist
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
