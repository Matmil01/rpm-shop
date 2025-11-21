<template>
  <Snackbar :message="snackbarMessage" :show="snackbarShow" />
  <div class="pt-10"></div>
  <div class="container mx-auto px-4 font-headline text-MyYellow">
    <div v-for="category in categories" :key="category" class="mb-10">
      <div class="flex flex-col items-center gap-3 md:gap-0 mb-4 md:flex-row md:justify-between md:items-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-headline w-full text-center uppercase">
          {{ category }}
        </h1>
        <SimpleButton :to="`/shop?tag=${encodeURIComponent(category)}`"
          class="inline-flex w-auto self-center md:self-auto">
          See all
        </SimpleButton>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="(record, index) in recordsByCategory(category)" :key="`${animationKey}-${record.id}`"
          class="card-hover rounded-3xl bg-MyDark p-4 shadow-MyYellow shadow animate-fade-in"
          :style="{ animationDelay: getDelay(index) }">
          <RecordCard :id="record.id" :album="record.album || ''" :artist="record.artist || ''"
            :coverImage="record.coverImage || ''" :price="Number(record.price) || 0"
            :discount="Number(record.discount) || 0" :stock="record.stock" :showSnackbar="showSnackbar" />
        </div>
      </div>
    </div>
  </div>
  <div class="pt-10"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRecordsCRUD } from '@/composables/CRUD/useRecordsCRUD'
import { useFeaturedRecords } from '@/composables/records/useFeaturedRecords'
import { useStaggerAnimation } from '@/composables/useStaggerAnimation'
import RecordCard from '@/components/user/RecordCard.vue'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import Snackbar from '@/components/Snackbar.vue'

// Snackbar message text
const snackbarMessage = ref('')
// Snackbar visibility state
const snackbarShow = ref(false)

// Helper to show snackbar notification
function showSnackbar(msg) {
  snackbarMessage.value = msg
  snackbarShow.value = true
  setTimeout(() => snackbarShow.value = false, 3000)
}

// List of record categories to display on homepage
const categories = [
  'Special Offers',
  'Soundtracks',
  'Staff Favorites',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  'Japan Imports',
  '7-Inch Singles'
]

// CRUD composable for records
const { records, listenToRecords, unsubscribeRecords } = useRecordsCRUD()
// Composable for getting records by category (featured logic)
const { recordsByCategory } = useFeaturedRecords(records)
const { animationKey, getDelay } = useStaggerAnimation(records)

// On mount: start listening to records collection
onMounted(() => {
  listenToRecords()
})

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
  background: radial-gradient(circle, #ffe2a9, transparent);
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
