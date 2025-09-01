<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-6">Add New Product</h1>
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

    <!-- Meta Data -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Product Meta Data</h2>
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
        <label class="block mb-1 font-medium">Genre</label>
        <input v-model="genre" type="text" class="w-full border rounded px-3 py-2" placeholder="Genre" />
      </div>
    </div>

    <!-- Storefront-Specific Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Storefront Settings</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Price (DDK)</label>
          <input v-model.number="price" type="number" min="0" class="w-full border rounded px-3 py-2" placeholder="Price" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Discount (%)</label>
          <input v-model.number="discount" type="number" min="0" max="100" class="w-full border rounded px-3 py-2" placeholder="Discount" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Stock Quantity</label>
          <input v-model.number="stock" type="number" min="0" class="w-full border rounded px-3 py-2" placeholder="Stock" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Tags</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" value="Staff Favorites" v-model="tags" />
              Staff Favorites
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="Special Offers" v-model="tags" />
              Special Offers
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="New Arrivals" v-model="tags" />
              New Arrivals
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="Rare Finds" v-model="tags" />
              Rare Finds
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="Under 100,-" v-model="tags" />
              Under 100,-
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="Soundtracks" v-model="tags" />
              Soundtracks
            </label>
          </div>
        </div>
        <button type="submit" class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
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

const searchQuery = ref('')
const { results, loading, error, searchAlbums, fetchReleaseDetails, clearResults } = useDiscogsSearch()
const { randomStock, randomPrice } = useRandomDefaults()
const { addProduct } = useFirestoreCRUD()

const tracklist = ref([])
const numRecords = ref('')

function onSearch() {
  if (searchQuery.value.trim()) {
    searchAlbums(searchQuery.value)
  }
}

async function fillForm(release) {
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
  genre.value = release.genre ? release.genre.join(', ') : ''
  rpm.value = ''

  // Fetch full release details for tracklist, number of records, and RPM
  const details = await fetchReleaseDetails(release.id)
  if (details) {
    tracklist.value = details.tracklist || []
    const vinylFormat = details.formats?.find(f => f.name === 'Vinyl')
    numRecords.value = vinylFormat?.qty || '1'
    // Try to extract RPM from format descriptions
    if (vinylFormat && Array.isArray(vinylFormat.descriptions)) {
      const rpmDesc = vinylFormat.descriptions.find(desc => desc.includes('RPM'))
      rpm.value = rpmDesc ? rpmDesc.replace(' RPM', '') : ''
    } else {
      rpm.value = ''
    }
  } else {
    tracklist.value = []
    numRecords.value = ''
    rpm.value = ''
  }

  clearResults()
}

async function onSubmit() {
  if (!stock.value || stock.value === '') {
    stock.value = randomStock()
  }
  if (!price.value || price.value === '') {
    price.value = randomPrice()
  }

  // Build the product object
  const product = {
    artist: artist.value,
    album: album.value,
    year: year.value,
    rpm: rpm.value,
    coverImage: coverImage.value,
    format: format.value,
    genre: genre.value,
    price: Number(price.value) || 0,
    discount: Number(discount.value) || 0,
    stock: Number(stock.value) || 0,
    tags: Array.isArray(tags.value) ? tags.value : [],
    tracklist: Array.isArray(tracklist.value) ? tracklist.value : [],
    numRecords: numRecords.value,
  }

  try {
    await addProduct(product)
    alert('Added to Firestore!')
  } catch (e) {
    alert('Error adding product: ' + e.message)
  }
}
</script>
