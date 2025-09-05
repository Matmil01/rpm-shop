<template>
  <div class="p-10 font-headline text-MyWhite">
    <h1 class="text-2xl font-bold mb-8">Full Shop</h1>
    <input
      v-model="search"
      type="text"
      placeholder="Search by artist or album..."
      class="mb-6 w-full border rounded px-3 py-2 text-black font-main"
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      <RecordCard
        v-for="record in filteredRecords"
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
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import RecordCard from '@/components/RecordCard.vue'

const route = useRoute()
const search = ref('')

const { records, listenToRecords, unsubscribeRecords } = useFirestoreCRUD()

onMounted(() => {
  listenToRecords()
})
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})

// Sync search box with ?search= query param
watch(
  () => route.query.search,
  (val) => {
    if (typeof val === 'string') search.value = val
  },
  { immediate: true }
)

const tag = computed(() => route.query.tag)
const filteredRecords = computed(() => {
  let filtered = tag.value
    ? records.value.filter(r => r.tags && r.tags.includes(tag.value))
    : records.value
  if (search.value) {
    const s = search.value.toLowerCase()
    filtered = filtered.filter(
      r =>
        r.artist.toLowerCase().includes(s) ||
        r.album.toLowerCase().includes(s)
    )
  }
  return filtered
})
</script>
