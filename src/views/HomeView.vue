<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyYellow">
    <div v-for="category in categories" :key="category" class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-4xl font-headline w-full text-center">{{ category }}</h2>
        <SimpleButton
          :to="`/shop?tag=${encodeURIComponent(category)}`"
        >
          See all
        </SimpleButton>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl bg-MyDark p-6 shadow-MyYellow shadow">
        <RecordCard
          v-for="record in recordsByCategory(category)"
          :key="record.id"
          :id="record.id"
          :album="record.album || ''"
          :artist="record.artist || ''"
          :coverImage="record.coverImage || ''"
          :price="Number(record.price) || 0"
          :discount="Number(record.discount) || 0"
          :stock="record.stock"
        />
      </div>
    </div>
  </div>
  <div class="pt-10"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useRecordSearch } from '@/composables/useRecordSearch'
import RecordCard from '@/components/RecordCard.vue'
import SimpleButton from '@/components/SimpleButton.vue'

const tag = ref('')
const search = ref('')

const categories = [
  'Soundtracks',
  'Staff Favorites',
  'Special Offers',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  'Japan Imports',
  '7-Inch Singles'
]

const { records, listenToRecords, unsubscribeRecords } = useFirestoreCRUD()
const { recordsByCategory } = useRecordSearch(records)

onMounted(() => {
  listenToRecords()
})
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})
</script>
