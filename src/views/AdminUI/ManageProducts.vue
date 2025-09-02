<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-6">Manage Products</h1>
    <input
      v-model="search"
      type="text"
      placeholder="Search by artist or album..."
      class="mb-4 w-full border rounded px-3 py-2"
    />
    <div v-if="loading" class="mb-4">Loading...</div>
    <table v-else class="w-full border-collapse border table-auto">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2 border min-w-[120px]">Artist</th>
          <th class="p-2 border min-w-[120px]">Album</th>
          <th class="p-2 border min-w-[80px]">Stock</th>
          <th class="p-2 border min-w-[80px]">Price</th>
          <th class="p-2 border min-w-[100px]">Discount</th>
          <th class="p-2 border min-w-[260px]">Tags</th>
          <th class="p-2 border min-w-[120px]">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id" class="border-t">
          <td class="p-2 border">{{ product.artist }}</td>
          <td class="p-2 border">{{ product.album }}</td>
          <td class="p-2 border">
            <input type="number" v-model.number="product.stock" class="border px-2 py-1 w-20" />
          </td>
          <td class="p-2 border">
            <input type="number" v-model.number="product.price" class="border px-2 py-1 w-20" />
          </td>
          <td class="p-2 border">
            <input type="number" v-model.number="product.discount" class="border px-2 py-1 w-20" min="0" max="100" />
          </td>
          <td class="p-2 border">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label v-for="tag in tagsList" :key="tag" class="flex items-center gap-1">
                <input type="checkbox" :value="tag" v-model="product.tags" />
                {{ tag }}
              </label>
            </div>
          </td>
          <td class="p-2 border align-middle">
            <div class="flex flex-col justify-between h-full gap-4">
              <button
                :disabled="savingId === product.id"
                @click="confirmDelete(product.id)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 w-full"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      @click="saveAllChanges"
      class="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
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

const { randomPrice } = useRandomDefaults()
const { records, loading, listenToRecords, updateRecord: crudUpdateRecord, deleteRecord: crudDeleteRecord, unsubscribeRecords } = useFirestoreCRUD()

const savingId = ref(null)
const saving = ref(false)
const search = ref('')
const tagsList = [
  'Staff Favorites',
  'Special Offers',
  'New Arrivals',
  'Rare Finds',
  'Under 100,-',
  'Soundtracks'
]

onMounted(() => {
  listenToRecords()
})
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})

const filteredRecords = computed(() => {
  if (!search.value) return records.value
  const s = search.value.toLowerCase()
  return records.value.filter(
    r =>
      r.artist?.toLowerCase().includes(s) ||
      r.album?.toLowerCase().includes(s)
  )
})

async function saveAllChanges() {
  saving.value = true
  try {
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
