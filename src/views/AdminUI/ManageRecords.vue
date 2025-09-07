<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <h1 class="text-2xl font-bold mb-6">Manage Stock</h1>
    <input
      v-model="search"
      type="text"
      placeholder="Search by artist or album..."
      class="mb-4 w-full border border-gray-500 bg-MyBlack rounded px-3 py-2 text-MyWhite font-main placeholder-gray-400"
    />
    <div v-if="loading" class="mb-4">Loading...</div>
    <div class="rounded overflow-hidden">
      <table class="w-full border-collapse border border-gray-500 table-auto font-main text-MyWhite bg-MyBlack">
        <thead>
          <tr class="bg-gray-900 text-left text-MyWhite font-main">
            <th class="p-2 border border-gray-500 min-w-[120px]">Artist</th>
            <th class="p-2 border border-gray-500 min-w-[120px]">Album</th>
            <th class="p-2 border border-gray-500 min-w-[80px]">Stock</th>
            <th class="p-2 border border-gray-500 min-w-[80px]">Price</th>
            <th class="p-2 border border-gray-500 min-w-[100px]">Discount</th>
            <th class="p-2 border border-gray-500 min-w-[260px]">Tags</th>
            <th class="p-2 border border-gray-500 min-w-[120px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id" class="border-t border-gray-500">
            <td class="p-2 border border-gray-500">{{ record.artist }}</td>
            <td class="p-2 border border-gray-500">{{ record.album }}</td>
            <td class="p-2 border border-gray-500">
              <input type="number" v-model.number="record.stock" class="border border-gray-500 bg-MyBlack px-2 py-1 w-20 text-MyWhite font-main rounded placeholder-gray-400" />
            </td>
            <td class="p-2 border border-gray-500">
              <input type="number" v-model.number="record.price" class="border border-gray-500 bg-MyBlack px-2 py-1 w-20 text-MyWhite font-main rounded placeholder-gray-400" />
            </td>
            <td class="p-2 border border-gray-500">
              <input type="number" v-model.number="record.discount" class="border border-gray-500 bg-MyBlack px-2 py-1 w-20 text-MyWhite font-main rounded placeholder-gray-400" min="0" max="100" />
            </td>
            <td class="p-2 border border-gray-500">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in record.tags"
                  :key="tag"
                  class="bg-blue-700 text-white px-2 py-1 rounded text-xs"
                >
                  {{ tag }}
                </span>
                <button
                  @click="record.showTagSelector = !record.showTagSelector"
                  class="bg-gray-700 text-white px-2 py-1 rounded text-xs cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div v-if="record.showTagSelector" class="mt-2 bg-gray-900 p-2 rounded shadow">
                <label v-for="tag in tagsList" :key="tag" class="flex items-center gap-1 mb-1">
                  <input type="checkbox" :value="tag" v-model="record.tags" />
                  {{ tag }}
                </label>
                <button @click="record.showTagSelector = false" class="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs cursor-pointer">Done</button>
              </div>
            </td>
            <td class="p-2 border border-gray-500 align-middle">
              <div class="flex flex-col justify-between h-full gap-4">
                <button
                  :disabled="savingId === record.id"
                  @click="confirmDelete(record.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 w-full font-main border border-gray-500"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      @click="saveAllChanges"
      class="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-main border border-gray-500"
      :disabled="saving"
    >
      <span v-if="saving">Saving...</span>
      <span v-else>Save All Changes</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useRandomDefaults } from '@/composables/useRandomDefaults.js'

const { randomStock, randomPrice } = useRandomDefaults()
const { records, loading, listenToRecords, updateRecord: crudUpdateRecord, deleteRecord: crudDeleteRecord, unsubscribeRecords } = useFirestoreCRUD()

const savingId = ref(null)
const saving = ref(false)
const search = ref('')
const tagsList = [
  'Staff Favorites',
  'New Arrivals',
  'Rare Finds',
  'Japan Imports',
  'Soundtracks',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  'Avant Garde'
]

onMounted(() => {
  listenToRecords()
  // Add showTagSelector property to each record for inline tag editing
  records.value.forEach(r => r.showTagSelector = false)
})
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})

const filteredRecords = computed(() => {
  let filtered = !search.value
    ? records.value
    : records.value.filter(
        r =>
          r.artist?.toLowerCase().includes(search.value.toLowerCase()) ||
          r.album?.toLowerCase().includes(search.value.toLowerCase())
      )
  // Sort alphabetically by artist, then album
  return filtered.slice().sort((a, b) => {
    const artistA = a.artist?.toLowerCase() || ''
    const artistB = b.artist?.toLowerCase() || ''
    if (artistA < artistB) return -1
    if (artistA > artistB) return 1
    // If artists are the same, sort by album
    const albumA = a.album?.toLowerCase() || ''
    const albumB = b.album?.toLowerCase() || ''
    return albumA.localeCompare(albumB)
  })
})

async function saveAllChanges() {
  saving.value = true
  try {
    for (const record of filteredRecords.value) {
      // Autofill stock and price if zero or empty
      if (!record.stock || record.stock === 0) {
        record.stock = randomStock()
      }
      if (!record.price || record.price === 0) {
        record.price = randomPrice()
      }
      await crudUpdateRecord(record.id, {
        artist: record.artist,
        album: record.album,
        stock: record.stock,
        price: record.price,
        discount: record.discount,
        tags: record.tags
      })
    }
    alert('All changes saved!')
  } catch (e) {
    alert('Error saving changes: ' + e.message)
  } finally {
    saving.value = false
  }
}

async function deleteRecord(id) {
  savingId.value = id
  try {
    await crudDeleteRecord(id)
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) records.value.splice(idx, 1)
  } catch (e) {
    alert('Error deleting record: ' + e.message)
  } finally {
    savingId.value = null
  }
}

function confirmDelete(id) {
  if (confirm('Are you sure?')) {
    deleteRecord(id)
  }
}
</script>
