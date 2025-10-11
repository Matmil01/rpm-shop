<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow ">
    <h1 class="text-2xl text-MyWhite font-headline mb-6">Manage Stock</h1>
    <input
      v-model="search"
      type="text"
      placeholder="Search by artist or album..."
      class="mb-4 w-full border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main"
    />
    <div v-if="loading" class="mb-4">Loading...</div>
    <div class="rounded overflow-hidden">
      <table class="w-full border-collapse border border-MyDark table-auto font-main text-MyWhite bg-MyBlack">
        <thead>
          <tr class="bg-MyDark text-center text-MyWhite font-main">
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
                  class="bg-MyYellow text-MyBlack px-2 py-1 rounded text-xs"
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
                <SimpleButton
                  class="mt-2 text-xs px-2 py-1"
                  @click="record.showTagSelector = false; autoSave(record, 'tags', record.tags)"
                >
                  Done
                </SimpleButton>
              </div>
            </td>
            <td class="p-2 border border-MyDark align-middle text-center">
              <TrashButton
                title="Delete record"
                :disabled="savingId === record.id"
                @click="() => savingId === record.id ? null : confirmDelete(record.id)"
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
import { useRecordsCRUD } from '@/composables/CRUD/useRecordsCRUD'
import { useRecordSearch } from '@/composables/useRecordSearch'
import { useSpecialOffersTag } from '@/composables/records/useSpecialOffersTag.js'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import TrashButton from '@/components/buttons/TrashButton.vue'

const { records, loading, listenToRecords, updateRecord: crudUpdateRecord, deleteRecord: crudDeleteRecord, unsubscribeRecords } = useRecordsCRUD()
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
  'Japan Imports',
  'Soundtracks',
  'Doom & Gloom',
  'Shock & Awe',
  'Dad Metal',
  '7-Inch Singles',
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
