<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyYellow">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center uppercase animate-fade-in">
      {{ tag ? tag : (search ? search : 'All Records') }}
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="(record, index) in filteredRecords" :key="`${animationKey}-${record.id}`"
        class="card-hover rounded-3xl bg-MyDark p-4 shadow-MyYellow shadow animate-stagger"
        :style="{ animationDelay: getDelay(index) }">
        <RecordCard :id="record.id" :album="record.album || ''" :artist="record.artist || ''"
          :coverImage="record.coverImage || ''" :price="Number(record.price) || 0"
          :discount="Number(record.discount) || 0" :stock="record.stock" />
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
import { useStaggerAnimation } from '@/composables/useStaggerAnimation'
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
const { animationKey, getDelay } = useStaggerAnimation(filteredRecords)

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

<style scoped>
.card-hover {
  position: relative;
}

.card-hover::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, transparent 0%, #ffe2a9 100%);
  opacity: 0;
  transition: opacity 500ms;
  pointer-events: none;
}

.card-hover:hover::before {
  opacity: 0.3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInSimple {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-stagger {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeInSimple 0.5s ease-out forwards;
}
</style>
