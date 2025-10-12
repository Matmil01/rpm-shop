<template>
  <div class="max-w-md mx-auto mt-10 p-6 rounded shadow font-main text-MyYellow">
    <h1 class="text-2xl font-headline text-MyWhite mb-6">Add New Record</h1>

    <!-- Discogs Search -->
    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Search Discogs</h3>
    <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow">
      <div class="mb-2 text-MyYellow font-bold text-left">Search Discogs</div>
      <form @submit.prevent="onSearch" class="mb-4 flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          class="flex-1 border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400"
          placeholder="Search Discogs..."
        />
        <SimpleButton
          type="submit"
          :onClick="onSearch"
        >
          Search
        </SimpleButton>
      </form>
      <div v-if="loading" class="mb-4 text-MyDark">Searching...</div>
      <div v-if="error" class="mb-4 text-MyRed">{{ error }}</div>
      <div v-if="results.length" class="space-y-2">
        <div
          v-for="release in results"
          :key="release.id"
          class="flex items-center gap-3 border rounded-3xl p-2 hover:bg-gray-700/60 cursor-pointer font-main text-MyWhite transition-colors duration-200"
          @click="fillForm(release)"
        >
          <img :src="release.cover_image" alt="" class="w-12 h-12 object-cover rounded" />
          <div>
            <div class="font-bold">{{ release.title }}</div>
            <div class="text-sm text-gray-700">
              {{ release.format ? release.format.join(', ') : '' }}
              <span v-if="release.label"> | {{ release.label.join(', ') }}</span>
            </div>
            <div class="text-xs text-gray-500">{{ release.year || 'Year unknown' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meta Data -->
    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Meta Data</h3>
    <div class="mb-8 p-4 rounded bg-MyDark shadow shadow-MyYellow">
      <div class="mb-4">
        <label class="block mb-1 font-medium">Artist</label>
        <input v-model="artist" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Artist Name" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Album</label>
        <input v-model="album" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Album Title" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Release Year</label>
        <input v-model="year" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Year" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">RPM</label>
        <input v-model="rpm" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="33, 45, 78" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Cover Image URL</label>
        <input v-model="coverImage" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 mb-2 font-main text-MyWhite placeholder-gray-400" placeholder="Cover Image URL" />
        <div v-if="coverImage" class="flex justify-center">
          <img :src="coverImage" alt="Cover" class="w-24 h-24 object-cover rounded shadow" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Format</label>
        <input v-model="format" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="e.g. Vinyl, LP, Album, 12" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Genre</label>
        <input v-model="genre" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Genre" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Number of Records</label>
        <input v-model="numRecords" type="text" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Number of Records" />
      </div>
    </div>

    <!-- Storefront Section -->
    <h3 class="text-xl font-bold mb-2 text-MyWhite text-left">Storefront Settings</h3>
    <div class="p-4 rounded bg-MyDark shadow shadow-MyYellow mb-6">
      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Price (DDK)</label>
          <input v-model.number="price" type="number" min="0" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Price" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Discount (%)</label>
          <input v-model.number="discount" type="number" min="0" max="100" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Discount" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Stock Quantity</label>
          <input v-model.number="stock" type="number" min="0" class="w-full border border-MyYellow bg-MyBlack rounded-full px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Stock" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Tags</label>
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="tag in tagsList"
              :key="tag"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input type="checkbox" :value="tag" v-model="tags" class="cursor-pointer" />
              {{ tag }}
            </label>
          </div>
        </div>
        <SimpleButton type="submit">
          Add to Firestore
        </SimpleButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDiscogsSearch } from '@/composables/API/useDiscogsSearch.js'
import { useRandomDefaults } from '@/composables/records/useRandomDefaults.js'
import { useReleaseMapper } from '@/composables/API/useReleaseMapper.js'
import { useRecordBuilder } from '@/composables/records/useRecordBuilder.js'
import { useSpecialOffersTag } from '@/composables/records/useSpecialOffersTag.js'
import { useRecordsCRUD } from '@/composables/CRUD/useRecordsCRUD'
import { useTags } from '@/composables/records/useTags'
import SimpleButton from '@/components/buttons/SimpleButton.vue'

const artist = ref('')
const album = ref('')
const year = ref('')
const rpm = ref('')
const coverImage = ref('')
const format = ref('')
const genre = ref('')
const price = ref(0)
const discount = ref(0)
const stock = ref(0)
const tags = ref([])
const tracklist = ref([])
const numRecords = ref('')

const searchQuery = ref('')
const { results, loading, error, searchAlbums, fetchReleaseDetails, clearResults } = useDiscogsSearch()
const { randomStock, randomPrice } = useRandomDefaults()
const { addRecord } = useRecordsCRUD()
const { mapReleaseToForm } = useReleaseMapper()
const { buildRecord } = useRecordBuilder()
const { applySpecialOffersTag } = useSpecialOffersTag()
const { tagsList, addTag, removeTag, toggleTag } = useTags()

function onSearch() {
  if (searchQuery.value.trim()) {
    searchAlbums(searchQuery.value)
  }
}

async function fillForm(release) {
  const mapped = await mapReleaseToForm(release, fetchReleaseDetails)
  artist.value = mapped.artist
  album.value = mapped.album
  year.value = mapped.year
  coverImage.value = mapped.coverImage
  format.value = mapped.format
  genre.value = mapped.genre
  rpm.value = mapped.rpm
  tracklist.value = mapped.tracklist
  numRecords.value = mapped.numRecords
  clearResults()
}

async function onSubmit() {
  const record = buildRecord({
    artist: artist.value,
    album: album.value,
    year: year.value,
    rpm: rpm.value,
    coverImage: coverImage.value,
    format: format.value,
    genre: genre.value,
    price: price.value,
    discount: discount.value,
    stock: stock.value,
    tags: tags.value,
    tracklist: tracklist.value,
    numRecords: numRecords.value,
  }, randomStock, randomPrice)

  applySpecialOffersTag(record)

  try {
    await addRecord(record)
    alert('Added to Firestore!')
  } catch (error) {
    alert('Error adding record: ' + error.message)
  }
}
</script>
