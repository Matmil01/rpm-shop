<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyYellow">
    <h1 class="text-4xl font-bold mb-8 text-center">
      {{ tag ? tag : (search ? search : 'All Records') }}
    </h1>
    <div class="bg-MyDark rounded-3xl p-6 shadow-MyYellow shadow">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <RecordCard
          v-for="record in filteredRecords"
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useRecordSearch } from '@/composables/useRecordSearch'
import RecordCard from '@/components/RecordCard.vue'

const route = useRoute()
const search = ref('')
const { records, listenToRecords, unsubscribeRecords } = useFirestoreCRUD()

const tag = computed(() => route.query.tag)
const { filteredRecords } = useRecordSearch(records, { tagRef: tag, searchRef: search, sortBy: 'artist', sortDirection: 'asc' })

onMounted(() => {
  listenToRecords()
})

watch(
  () => route.query.search,
  (newSearch) => {
    search.value = newSearch || ''
  },
  { immediate: true }
)

onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})
</script>
