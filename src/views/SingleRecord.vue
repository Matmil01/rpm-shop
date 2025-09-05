<template>
  <div
    class="p-6 font-main text-MyWhite rounded shadow-lg"
    style="background-image: url('/Texturelabs_InkPaint_368XL.jpg'); background-repeat: repeat; background-position: center;"
  >
    <div class="flex flex-col md:flex-row gap-12 md:gap-16">
      <!-- Left: Main Info & Cover -->
      <div class="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
        <h1 class="text-2xl font-bold">{{ record.album }}</h1>
        <div class="text-lg">
          <router-link
            :to="`/shop?search=${encodeURIComponent(record.artist)}`"
            class="text-MyWhite underline hover:text-blue-400"
          >
            {{ record.artist }}
          </router-link>
        </div>
        <img
          :src="record.coverImage"
          alt=""
          class="w-full max-w-md md:w-96 md:h-96 object-cover rounded shadow"
        />
        <div>
          <span v-if="record.discount && record.discount > 0">
            <span class="line-through text-gray-400 mr-2">{{ record.price }} kr.</span>
            <span class="text-red-600 font-bold">{{ discountedPrice }} kr.</span>
            <span class="ml-2 text-green-700 font-semibold">-{{ record.discount }}%</span>
          </span>
          <span v-else>
            <span class="text-gray-500">Price: {{ record.price }} kr.</span>
          </span>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-MyWhite rounded hover:bg-blue-700 font-bold">Add to Cart 🛒</button>
      </div>

      <!-- Right: Details & Tracklist -->
      <div class="flex-1 flex flex-col gap-8">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-4 mb-2">
          <div><dt class="font-semibold">Genre:</dt><dd>{{ record.genre || 'Unknown' }}</dd></div>
          <div><dt class="font-semibold">Year:</dt><dd>{{ record.year || 'Unknown' }}</dd></div>
          <div><dt class="font-semibold">Speed:</dt><dd>{{ record.rpm || '33 RPM' }}</dd></div>
          <div><dt class="font-semibold">Format:</dt><dd>{{ record.format || '12"' }}</dd></div>
          <div><dt class="font-semibold">Stock:</dt>
            <dd>
              <span v-if="record.stock > 0 && record.stock < 5" class="text-red-600 font-semibold">
                Only {{ record.stock }} left, order now!
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
        <router-link to="/shop" class="text-MyWhite underline hover:text-blue-400">← Back to Shop</router-link>
      </div>
    </div>
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
