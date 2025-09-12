<template>
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyWhite">
    <h1 class="text-4xl font-bold mb-8">
      {{ tag ? tag : (search ? search : 'All Records') }}
    </h1>
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
  <div class="pt-10"></div>
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

const tag = computed(() => route.query.tag)
const filteredRecords = computed(() => {
  let base = records.value

  if (tag.value) {
    if (tag.value === 'Special Offers') {
      // Derive from discount instead of tag
      base = base.filter(r => Number(r.discount) > 0)
    } else {
      base = base.filter(r => r.tags && r.tags.includes(tag.value))
    }
  }

  if (search.value) {
    const s = search.value.toLowerCase()
    base = base.filter(
      r =>
        r.artist?.toLowerCase().includes(s) ||
        r.album?.toLowerCase().includes(s) ||
        r.genre?.toLowerCase().includes(s)
    )
  }
  return base
})
</script>
