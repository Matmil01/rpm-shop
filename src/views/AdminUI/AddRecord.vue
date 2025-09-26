<template>
  <div class="max-w-md mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <h1 class="text-2xl font-bold mb-6">Add New Record</h1>
    <!-- Search Discogs -->
    <form @submit.prevent="onSearch" class="mb-6 flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        class="flex-1 border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400"
        placeholder="Search Discogs..."
      />
      <button
        type="submit"
        class="px-6 py-2 rounded font-main cursor-pointer border border-MyWhite text-MyWhite bg-transparent transition duration-200 ease-in-out hover:border-MyDark"
      >
        Search
      </button>
    </form>
    <!-- Results List -->
    <div v-if="loading" class="mb-4 text-MyDark">Searching...</div>
    <div v-if="error" class="mb-4 text-MyRed">{{ error }}</div>
    <div v-if="results.length" class="mb-6 space-y-2">
      <div
        v-for="release in results"
        :key="release.id"
        class="flex items-center gap-3 border rounded p-2 hover:bg-gray-700/60 cursor-pointer font-main text-MyWhite transition-colors duration-200"
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

    <!-- Meta Data -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Meta Data</h2>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Artist</label>
        <input v-model="artist" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Artist Name" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Album</label>
        <input v-model="album" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Album Title" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Release Year</label>
        <input v-model="year" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Year" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">RPM</label>
        <input v-model="rpm" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="33, 45, 78" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Cover Image URL</label>
        <input v-model="coverImage" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 mb-2 font-main text-MyWhite placeholder-gray-400" placeholder="Cover Image URL" />
        <div v-if="coverImage" class="flex justify-center">
          <img :src="coverImage" alt="Cover" class="w-24 h-24 object-cover rounded shadow" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Format</label>
        <input v-model="format" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="e.g. Vinyl, LP, Album, 12" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Genre</label>
        <input v-model="genre" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Genre" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Number of Records</label>
        <input v-model="numRecords" type="text" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Number of Records" />
      </div>
    </div>

    <!-- Storefront Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Storefront Settings</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Price (DDK)</label>
          <input v-model.number="price" type="number" min="0" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Price" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Discount (%)</label>
          <input v-model.number="discount" type="number" min="0" max="100" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Discount" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Stock Quantity</label>
          <input v-model.number="stock" type="number" min="0" class="w-full border border-MyDark bg-MyBlack rounded px-3 py-2 font-main text-MyWhite placeholder-gray-400" placeholder="Stock" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Tags</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="Staff Favorites" v-model="tags" class="cursor-pointer" />
              Staff Favorites
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="Japan Imports" v-model="tags" class="cursor-pointer" />
              Japan Imports
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="Soundtracks" v-model="tags" class="cursor-pointer" />
              Soundtracks
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="Doom & Gloom" v-model="tags" class="cursor-pointer" />
              Doom & Gloom
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="Shock & Awe" v-model="tags" class="cursor-pointer" />
              Shock & Awe
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="Dad Metal" v-model="tags" class="cursor-pointer" />
              Dad Metal
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value="7-Inch Singles" v-model="tags" class="cursor-pointer" />
              7-Inch Singles
            </label>
          </div>
        </div>
        <button
          type="submit"
          class="px-6 py-2 rounded font-main cursor-pointer border border-MyWhite text-MyWhite bg-transparent transition duration-200 ease-in-out hover:border-MyDark"
        >
          Add to Firestore
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDiscogsSearch } from '@/composables/useDiscogsSearch.js'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import { useRandomDefaults } from '@/composables/useRandomDefaults.js'
import { useReleaseMapper } from '@/composables/useReleaseMapper.js'
import { useRecordBuilder } from '@/composables/useRecordBuilder.js'
import { useSpecialOffersTag } from '@/composables/useSpecialOffersTag.js'

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
const { addRecord } = useFirestoreCRUD()
const { mapReleaseToForm } = useReleaseMapper()
const { buildRecord } = useRecordBuilder()
const { applySpecialOffersTag } = useSpecialOffersTag()

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
