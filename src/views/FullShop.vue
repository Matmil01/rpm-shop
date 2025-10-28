<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyYellow">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center uppercase">
      {{ tag ? tag : (search ? search : 'All Records') }}
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="record in filteredRecords"
        :key="record.id"
        class="rounded-3xl bg-MyDark p-4 shadow-MyYellow shadow"
      >
        <RecordCard
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
import { useRecordsCRUD } from '@/composables/CRUD/useRecordsCRUD'
import { useRecordSearch } from '@/composables/records/useRecordSearch'
import RecordCard from '@/components/user/RecordCard.vue'

// Get route instance for reading query params
const route = useRoute()

// Search input for filtering records by artist/album
const search = ref('')

// CRUD composable for records
const { records, listenToRecords, unsubscribeRecords } = useRecordsCRUD()

// Computed: current tag/category from route query
const tag = computed(() => route.query.tag)
const { filteredRecords } = useRecordSearch(records, { tagRef: tag, searchRef: search, sortBy: 'artist', sortDirection: 'asc' })

// On mount: start listening to records collection
onMounted(() => {
  listenToRecords()
})

// Watch for changes to search query in route and update search input
watch(
  () => route.query.search,
  (newSearch) => {
    search.value = newSearch || ''
  },
  { immediate: true }
)

// On unmount: unsubscribe from records listener
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})
</script>
