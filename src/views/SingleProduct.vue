<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-1">{{ record.album }}</h1>
    <div class="text-lg text-gray-700 mb-4">
      <router-link
        :to="`/shop?search=${encodeURIComponent(record.artist)}`"
        class="text-blue-600 hover:underline"
      >
        {{ record.artist }}
      </router-link>
    </div>
    <img :src="record.coverImage" alt="" class="w-64 h-64 object-cover mb-4 rounded shadow" />
    <div class="mb-2">
      <span v-if="record.discount && record.discount > 0">
        <span class="line-through text-gray-400 mr-2">{{ record.price }} kr.</span>
        <span class="text-red-600 font-bold">{{ discountedPrice }} kr.</span>
        <span class="ml-2 text-green-700 font-semibold">-{{ record.discount }}%</span>
      </span>
      <span v-else>
        <span>Price: {{ record.price }} kr.</span>
      </span>
    </div>
    <p class="mb-2">Genre: {{ record.genre || 'Unknown' }}</p>
    <p class="mb-2">Year: {{ record.year || 'Unknown' }}</p>
    <p class="mb-2">Speed: {{ record.rpm || '33 RPM' }}</p>
    <p class="mb-2">Format: {{ record.format || '12"' }}</p>
    <p class="mb-2">
      Stock:
      <span v-if="record.stock > 0 && record.stock < 5" class="text-red-600 font-semibold ml-2">
        Only {{ record.stock }} left, order now!
      </span>
      <span v-else>
        {{ record.stock }}
      </span>
    </p>
    <p class="mb-2">Number of Records: {{ record.numRecords || '1' }}</p>
    <div v-if="record.tracklist && record.tracklist.length" class="mb-4">
      <h2 class="text-lg font-semibold mb-2">Tracklist</h2>
      <ol class="list-decimal list-inside space-y-1">
        <li v-for="(track, idx) in record.tracklist" :key="idx">
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
const record = ref({})
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
  if (!record.value.discount || record.value.discount <= 0) return record.value.price
  return Math.round(record.value.price * (1 - record.value.discount / 100))
})
</script>
