<template>
  <div class="container mx-auto px-4">
    <div class="p-6 font-main text-MyWhite rounded shadow-lg relative">
      <div class="flex flex-col md:flex-row gap-12 md:gap-16">
        <!-- Left: Main Info & Cover -->
        <div
          v-if="record && record.id"
          class="flex-shrink-0 flex flex-col items-center md:items-start gap-4"
        >
          <img
            :src="record.coverImage"
            alt="Album Cover"
            class="w-full max-w-md md:w-96 md:h-96 object-cover rounded shadow"
          />
          <div class="text-lg font-bold text-left mb-1">
            {{ record.album }}
          </div>
          <router-link
            :to="`/shop?search=${encodeURIComponent(record.artist)}`"
            class="text-MyWhite underline hover:opacity-70 transition text-left block mb-2"
          >
            {{ record.artist }}
          </router-link>
          <div class="flex items-center justify-start mt-4 gap-4">
            <AddToCartButton
              v-if="record.stock > 0"
              :item="{
                id: record.id,
                album: record.album,
                artist: record.artist,
                coverImage: record.coverImage,
                price: record.price,
                discount: record.discount
              }"
            />
            <button
              v-if="record.id"
              @click="addToWishlist"
              class="px-6 py-2 rounded font-main cursor-pointer border border-MyWhite text-MyWhite bg-transparent transition duration-200 ease-in-out hover:border-MyDark ml-2"
              :disabled="wishlistHasRecord"
            >
              <span v-if="wishlistHasRecord">In Wishlist</span>
              <span v-else>Add to Wishlist</span>
            </button>
            <div v-else class="px-6 py-3 bg-gray-500 text-MyWhite rounded opacity-75 cursor-not-allowed">
              Out of Stock
            </div>
          </div>
        </div>

        <!-- Right: Details & Tracklist -->
        <div class="flex-1 flex flex-col gap-8">
          <dl class="grid grid-cols-2 gap-x-4 gap-y-4 mb-2">
            <div>
              <dt class="font-semibold">Genre:</dt>
              <dd>
                <template v-if="record.genre">
                  <span v-for="(genre, idx) in record.genre.split(',').map(s => s.trim())" :key="genre">
                    <router-link
                      :to="`/shop?search=${encodeURIComponent(genre)}`"
                      class="underline hover:opacity-70 transition"
                    >
                      {{ genre }}
                    </router-link>
                    <span v-if="idx < record.genre.split(',').length - 1">, </span>
                  </span>
                </template>
                <span v-else>Unknown</span>
              </dd>
            </div>
            <div><dt class="font-semibold">Year:</dt><dd>{{ record.year || 'Unknown' }}</dd></div>
            <div><dt class="font-semibold">Speed:</dt><dd>{{ record.rpm || '33 RPM' }}</dd></div>
            <div><dt class="font-semibold">Format:</dt><dd>{{ record.format || '12"' }}</dd></div>
            <div><dt class="font-semibold">Stock:</dt>
              <dd>
                <span v-if="record.stock > 0 && record.stock < 5" class="text-red-600 font-semibold">
                  Only {{ record.stock }} left, order now!
                </span>
                <span v-else-if="record.stock === 0" class="text-red-600 font-semibold">
                  Out of Stock
                </span>
                <span v-else>
                  {{ record.stock }}
                </span>
              </dd>
            </div>
            <div><dt class="font-semibold">Number of Records:</dt><dd>{{ record.numRecords || '1' }}</dd></div>
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
          <router-link to="/shop" class="text-MyWhite underline hover:opacity-70 transition">← Back to Shop</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import AddToCartButton from '@/components/AddToCartButton.vue'
import { useWishlistStore } from '@/composables/piniaStores/wishlistStore'

const route = useRoute()
const record = ref({})
const cart = useCartStore()
const wishlist = useWishlistStore()
const { calculateDiscountedPrice } = usePriceCalculator()
let unsubscribe = null

const { listenToRecord } = useFirestoreCRUD()

onMounted(() => {
  unsubscribe = listenToRecord(route.params.id, (result) => {
    if (result) record.value = result
  })
})
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const discountedPrice = computed(() => {
  if (record.value && record.value.price) {
    return calculateDiscountedPrice(record.value.price, record.value.discount || 0)
  }
  return 0
})

const wishlistHasRecord = computed(() =>
  wishlist.items.some(item => item.id === record.value.id)
)
async function addToWishlist() {
  if (!record.value.id || wishlistHasRecord.value) return
  await wishlist.addToWishlist({
    id: record.value.id,
    album: record.value.album,
    artist: record.value.artist,
    coverImage: record.value.coverImage,
    price: record.value.price,
    discount: record.value.discount
  })
}
</script>
