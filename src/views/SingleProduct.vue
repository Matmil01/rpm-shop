<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-1">{{ product.album }}</h1>
    <div class="text-lg text-gray-700 mb-4">
      <router-link
        :to="`/shop?search=${encodeURIComponent(product.artist)}`"
        class="text-blue-600 hover:underline"
      >
        {{ product.artist }}
      </router-link>
    </div>
    <img :src="product.coverImage" alt="" class="w-64 h-64 object-cover mb-4 rounded shadow" />
    <div class="mb-2">
      <span v-if="product.discount && product.discount > 0">
        <span class="line-through text-gray-400 mr-2">{{ product.price }} kr.</span>
        <span class="text-red-600 font-bold">{{ discountedPrice }} kr.</span>
        <span class="ml-2 text-green-700 font-semibold">-{{ product.discount }}%</span>
      </span>
      <span v-else>
        <span>Price: {{ product.price }} kr.</span>
      </span>
    </div>
    <p class="mb-2">Genre: {{ product.genre || 'Unknown' }}</p>
    <p class="mb-2">Year: {{ product.year || 'Unknown' }}</p>
    <p class="mb-2">Speed: {{ product.rpm || '33 RPM' }}</p>
    <p class="mb-2">Format: {{ product.format || '12"' }}</p>
    <p class="mb-2">
      Stock:
      <span v-if="product.stock > 0 && product.stock < 5" class="text-red-600 font-semibold ml-2">
        Only {{ product.stock }} left, order now!
      </span>
      <span v-else>
        {{ product.stock }}
      </span>
    </p>
    <p class="mb-2">Number of Records: {{ product.numRecords || '1' }}</p>
    <div v-if="product.tracklist && product.tracklist.length" class="mb-4">
      <h2 class="text-lg font-semibold mb-2">Tracklist</h2>
      <ol class="list-decimal list-inside space-y-1">
        <li v-for="(track, idx) in product.tracklist" :key="idx">
          {{ track.position ? track.position + '. ' : '' }}{{ track.title }}
          <span v-if="track.duration" class="text-gray-500 text-sm">({{ track.duration }})</span>
        </li>
      </ol>
    </div>
    <router-link to="/shop" class="text-blue-500 hover:underline">← Back to Shop</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'

const route = useRoute()
const product = ref({})
let unsubscribe = null

const { listenToProduct } = useFirestoreCRUD()

onMounted(() => {
  unsubscribe = listenToProduct(route.params.id, (result) => {
    if (result) product.value = result
  })
})
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const discountedPrice = computed(() => {
  if (!product.value.discount || product.value.discount <= 0) return product.value.price
  return Math.round(product.value.price * (1 - product.value.discount / 100))
})
</script>
