<template>
  <Snackbar :message="snackbarMessage" :show="snackbarShow" />
  <div class="pt-10"></div>
  <div class="container mx-auto px-4">
    <div class="rounded-3xl bg-MyDark p-6 shadow-MyYellow shadow font-main text-MyYellow relative">
      <div class="flex flex-col md:flex-row gap-12 md:gap-16">
        <div v-if="record && record.id" class="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
          <img :src="record.coverImage" alt="Album Cover"
            class="w-full max-w-md md:w-96 md:h-96 object-cover rounded shadow" />
          <div class="text-base md:text-lg font-bold text-center md:text-left mb-1">
            {{ record.album }}
          </div>
          <router-link :to="`/shop?search=${encodeURIComponent(record.artist)}`"
            class="text-MyYellow underline hover:opacity-70 transition text-center md:text-left block mb-2">
            {{ record.artist }}
          </router-link>
          <div
            class="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-start mt-4 gap-3 md:gap-4">
            <AddToCartButton v-if="record.stock > 0" :item="{
              id: record.id,
              album: record.album,
              artist: record.artist,
              coverImage: record.coverImage,
              price: record.price,
              discount: record.discount
            }" @added="showSnackbar('Added to cart!')" />
            <OutOfStock v-else-if="record.id && record.stock === 0" />
            <WishlistButton v-if="record.id" :record="record" @added="showSnackbar('Added to wishlist!')"
              @removed="showSnackbar('Removed from wishlist!')" />
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-8">
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mb-2">
            <div>
              <dt class="font-semibold">Genre:</dt>
              <dd>
                <template v-if="record.genre">
                  <span v-for="(genre, idx) in record.genre.split(',').map(s => s.trim())" :key="genre">
                    <router-link :to="`/shop?search=${encodeURIComponent(genre)}`"
                      class="underline hover:opacity-70 transition">
                      {{ genre }}
                    </router-link>
                    <span v-if="idx < record.genre.split(',').length - 1">, </span>
                  </span>
                </template>
                <span v-else>Unknown</span>
              </dd>
            </div>
            <div>
              <dt class="font-semibold">Year:</dt>
              <dd>{{ record.year || 'Unknown' }}</dd>
            </div>
            <div>
              <dt class="font-semibold">Speed:</dt>
              <dd>{{ record.rpm || '33 RPM' }}</dd>
            </div>
            <div>
              <dt class="font-semibold">Format:</dt>
              <dd>{{ record.format || '12"' }}</dd>
            </div>
            <div>
              <dt class="font-semibold">Stock:</dt>
              <dd>
                <span v-if="record.stock > 0 && record.stock < 5" class="text-MyRed font-semibold">
                  Only {{ record.stock }} left, order now!
                </span>
                <span v-else-if="record.stock === 0" class="text-MyRed font-semibold">
                  Out of Stock
                </span>
                <span v-else>
                  {{ record.stock }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="font-semibold">Number of Records:</dt>
              <dd>{{ record.numRecords || '1' }}</dd>
            </div>
          </dl>
          <div v-if="record.tracklist && record.tracklist.length">
            <h2 class="text-lg font-semibold mb-2">Tracklist</h2>
            <ol class="list-decimal list-inside space-y-1">
              <li v-for="(track, idx) in record.tracklist" :key="idx">
                {{ track.position ? track.position + '. ' : '' }}{{ track.title }}
                <span v-if="track.duration" class="text-gray-400 text-sm">({{ track.duration }})</span>
              </li>
            </ol>
          </div>
          <router-link to="/shop" class="text-MyYellow underline hover:opacity-70 transition duration-200 ease-in-out">←
            Back to
            Shop</router-link>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <CommentsSection v-if="record && record.id" :record-id="record.id" />
    </div>
  </div>
  <div class="pt-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useRecordsCRUD } from '@/composables/CRUD/useRecordsCRUD'
import AddToCartButton from '@/components/buttons/AddToCartButton.vue'
import OutOfStock from '@/components/buttons/OutOfStock.vue'
import WishlistButton from '@/components/buttons/WishlistButton.vue'
import CommentsSection from '@/components/user/CommentsSection.vue'
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

// Vue Router for record ID param
const route = useRoute()
// Reactive record object
const record = ref({})
// Access cart store
const cart = useCartStore()
// Price calculation function
const { calculateDiscountedPrice } = usePriceCalculator()
// Access user store
const userStore = useUserStore()
// Unsubscribe function for record listener
let unsubscribe = null

// CRUD composable for listening to a single record
const { listenToRecord } = useRecordsCRUD()

// On mount: listen to record changes by ID
onMounted(() => {
  unsubscribe = listenToRecord(route.params.id, (result) => {
    if (result) record.value = result
  })
})

// On unmount: unsubscribe from record listener
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Computed: discounted price for the record
const discountedPrice = computed(() => {
  if (record.value && record.value.price) {
    return calculateDiscountedPrice(record.value.price, record.value.discount || 0)
  }
  return 0
})
</script>
