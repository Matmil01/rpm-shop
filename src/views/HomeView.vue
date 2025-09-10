<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyWhite">
    <h1 class="text-2xl font-bold mb-8">
      {{ tag ? tag : (search ? search : 'All Records') }}
    </h1>
    <div v-for="category in categories" :key="category" class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ category }}</h2>
        <router-link :to="`/shop?tag=${encodeURIComponent(category)}`" class="text-blue-600 hover:underline">
          See all
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <RecordCard
          v-for="record in recordsByCategory(category)"
          :key="record.id"
          :id="record.id"
          :album="record.album || ''"
          :artist="record.artist || ''"
          :coverImage="record.coverImage || ''"
          :price="Number(record.price) || 0"
          :discount="Number(record.discount) || 0"
        />
      </div>
    </div>
  </div>
  <div class="pt-10"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import RecordCard from '@/components/RecordCard.vue'

const tag = ref('')
const search = ref('')

const categories = [
  'Soundtracks',
  'Staff Favorites',
  'Special Offers',
  // 'New Arrivals',
  'Japan Imports',
  // 'Rare Finds',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  'Avant Garde'
]

const { records, listenToRecords, unsubscribeRecords } = useFirestoreCRUD()

onMounted(() => {
  listenToRecords()
})
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})

function recordsByCategory(category) {
  if (category === 'Special Offers') {
    // Show records with a discount
    return records.value
      .filter(r => Number(r.discount) > 0)
      .slice(0, 4)
  }
  // Default: filter by tag
  return records.value
    .filter(r => r.tags && r.tags.includes(category))
    .slice(0, 4)
}
</script>
