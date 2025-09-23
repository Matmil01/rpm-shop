<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <h1 class="text-2xl font-bold mb-6">Manage Stock</h1>
    <input
      v-model="search"
      type="text"
      placeholder="Search by artist or album..."
      class="mb-4 w-full border border-MyDark bg-MyBlack rounded px-3 py-2 text-MyWhite font-main"
    />
    <div v-if="loading" class="mb-4">Loading...</div>
    <div class="rounded overflow-hidden">
      <table class="w-full border-collapse border border-MyDark table-auto font-main text-MyWhite bg-MyBlack">
        <thead>
          <tr class="bg-gray-900 text-left text-MyWhite font-main">
            <th class="p-2 border border-MyDark min-w-[120px]">Artist</th>
            <th class="p-2 border border-MyDark min-w-[120px]">Album</th>
            <th class="p-2 border border-MyDark min-w-[80px]">Stock</th>
            <th class="p-2 border border-MyDark min-w-[80px]">Price</th>
            <th class="p-2 border border-MyDark min-w-[100px]">Discount %</th>
            <th class="p-2 border border-MyDark min-w-[260px]">Category tags</th>
            <th class="p-2 border border-MyDark min-w-[60px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id" class="border-t border-MyDark">
            <td class="p-2 border border-MyDark">{{ record.artist }}</td>
            <td class="p-2 border border-MyDark">{{ record.album }}</td>
            <td class="p-2 border border-MyDark">
              <input
                type="number"
                v-model.number="record.stock"
                @change="autoSave(record, 'stock', record.stock)"
                class="border border-MyDark bg-MyBlack px-2 py-1 w-20 text-MyWhite font-main rounded placeholder-gray-400"
              />
            </td>
            <td class="p-2 border border-MyDark">
              <input
                type="number"
                v-model.number="record.price"
                @change="autoSave(record, 'price', record.price)"
                class="border border-MyDark bg-MyBlack px-2 py-1 w-20 text-MyWhite font-main rounded placeholder-gray-400"
              />
            </td>
            <td class="p-2 border border-MyDark">
              <input
                type="number"
                v-model.number="record.discount"
                @change="autoSave(record, 'discount', record.discount)"
                min="0" max="100"
                class="border border-MyDark bg-MyBlack px-2 py-1 w-20 text-MyWhite font-main rounded placeholder-gray-400"
              />
            </td>
            <td class="p-2 border border-MyDark">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in record.tags"
                  :key="tag"
                  class="bg-blue-700 text-MyWhite px-2 py-1 rounded text-xs"
                >
                  {{ tag }}
                </span>
                <button
                  @click="record.showTagSelector = !record.showTagSelector"
                  class="bg-gray-700 text-MyWhite px-2 py-1 rounded text-xs cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div v-if="record.showTagSelector" class="mt-2 bg-MyDark p-2 rounded shadow">
                <label v-for="tag in tagsList" :key="tag" class="flex items-center gap-1 mb-1">
                  <input type="checkbox" :value="tag" v-model="record.tags" />
                  {{ tag }}
                </label>
                <button
                  @click="record.showTagSelector = false; autoSave(record, 'tags', record.tags)"
                  class="mt-2 bg-blue-600 text-MyWhite px-2 py-1 rounded text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </td>
            <td class="p-2 border border-gray-500 align-middle text-center">
              <img
                src="/Icons/trashIcon.svg"
                alt="Delete"
                class="w-6 h-6 cursor-pointer hover:brightness-75 transition-all inline-block"
                :class="{ 'opacity-50 cursor-not-allowed': savingId === record.id }"
                @click="savingId === record.id ? null : confirmDelete(record.id)"
                title="Delete record"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useRandomDefaults } from '@/composables/useRandomDefaults.js'
import { useRecordSearch } from '@/composables/useRecordSearch'
import { useSpecialOffersTag } from '@/composables/useSpecialOffersTag.js'

const { randomStock, randomPrice } = useRandomDefaults()
const { records, loading, listenToRecords, updateRecord: crudUpdateRecord, deleteRecord: crudDeleteRecord, unsubscribeRecords } = useFirestoreCRUD()
const { applySpecialOffersTag, applyToAll } = useSpecialOffersTag()

const search = ref('')
const { filteredRecords } = useRecordSearch(records, {
  searchRef: search,
  fields: ['artist', 'album'],
  sortBy: 'artist',
  sortDirection: 'asc'
})

const savingId = ref(null)

const tagsList = [
  'Staff Favorites',
  'New Arrivals',
  'Rare Finds',
  'Japan Imports',
  'Soundtracks',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  'Avant Garde',
]

onMounted(() => {
  listenToRecords()
  records.value.forEach(record => {
    record.showTagSelector = false
    applySpecialOffersTag(record)
  })
})
onUnmounted(() => {
  if (unsubscribeRecords) unsubscribeRecords()
})

watch(() => records.value, (newRecords) => {
  if (!newRecords) return
  newRecords.forEach(record => {
    if (record._previousDiscount !== record.discount) {
      applySpecialOffersTag(record)
      record._previousDiscount = record.discount
    }
  })
}, { deep: true })

async function autoSave(record, field, value) {
  try {
    await crudUpdateRecord(record.id, { [field]: value })
  } catch (error) {
    alert('Error saving change: ' + error.message)
  }
}

async function deleteRecord(id) {
  savingId.value = id
  try {
    await crudDeleteRecord(id)
    const idx = records.value.findIndex(record => record.id === id)
    if (idx !== -1) records.value.splice(idx, 1)
  } catch (error) {
    alert('Error deleting record: ' + error.message)
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
