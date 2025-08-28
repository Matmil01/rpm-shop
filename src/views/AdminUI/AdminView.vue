<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-6">Add New</h1>
    <!-- Search Discogs -->
    <form @submit.prevent="onSearch" class="mb-6 flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        class="flex-1 border rounded px-3 py-2"
        placeholder="Search Discogs for album..."
      />
      <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Search
      </button>
    </form>
    <!-- Results List -->
    <div v-if="loading" class="mb-4 text-gray-500">Searching...</div>
    <div v-if="error" class="mb-4 text-red-500">{{ error }}</div>
    <div v-if="results.length" class="mb-6 space-y-2">
      <div
        v-for="release in results"
        :key="release.id"
        class="flex items-center gap-3 border rounded p-2 hover:bg-gray-100 cursor-pointer"
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
    <!-- Add Record Form -->
    <form>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Artist</label>
        <input v-model="artist" type="text" class="w-full border rounded px-3 py-2" placeholder="Artist Name" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Album</label>
        <input v-model="album" type="text" class="w-full border rounded px-3 py-2" placeholder="Album Title" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Release Year</label>
        <input v-model="year" type="text" class="w-full border rounded px-3 py-2" placeholder="Year" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">RPM</label>
        <input v-model="rpm" type="text" class="w-full border rounded px-3 py-2" placeholder="33, 45, 78" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Cover Image URL</label>
        <input v-model="coverImage" type="text" class="w-full border rounded px-3 py-2 mb-2" placeholder="Cover Image URL" />
        <div v-if="coverImage" class="flex justify-center">
          <img :src="coverImage" alt="Cover" class="w-24 h-24 object-cover rounded shadow" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Format</label>
        <input v-model="format" type="text" class="w-full border rounded px-3 py-2" placeholder="e.g. Vinyl, LP, Album, 12&quot;" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Label</label>
        <input v-model="label" type="text" class="w-full border rounded px-3 py-2" placeholder="Label" />
      </div>
      <button type="submit" class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
        Add Record
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDiscogsSearch } from '@/composables/useDiscogsSearch.js'

const artist = ref('')
const album = ref('')
const year = ref('')
const rpm = ref('')
const coverImage = ref('')
const format = ref('')
const label = ref('')

const searchQuery = ref('')
const { results, loading, error, searchAlbums, clearResults } = useDiscogsSearch()

function onSearch() {
  if (searchQuery.value.trim()) {
    searchAlbums(searchQuery.value)
  }
}

function fillForm(release) {
  // Discogs API returns title as "Artist - Album", so split if needed
  if (release.title && release.title.includes(' - ')) {
    const [artistName, albumTitle] = release.title.split(' - ')
    artist.value = artistName
    album.value = albumTitle
  } else {
    album.value = release.title || ''
    artist.value = release.artist || ''
  }
  year.value = release.year || ''
  coverImage.value = release.cover_image || ''
  format.value = release.format ? release.format.join(', ') : ''
  label.value = release.label ? release.label.join(', ') : ''
  rpm.value = ''
  clearResults() // <-- This will hide the results list after selection
}
</script>
