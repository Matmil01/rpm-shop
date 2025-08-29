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
                @click="updateProduct(product)"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
              >
                <span v-if="savingId === product.id">Saving...</span>
                <span v-else>Update</span>
              </button>
              <button
                :disabled="savingId === product.id"
                @click="deleteProduct(product.id)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 w-full"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const products = ref([])
const loading = ref(true)
const savingId = ref(null)
const search = ref('')
const tagsList = [
  'Staff Favorite',
  'Bestsellers',
  'New Arrivals',
  'Rare Finds',
  'Under 100,-',
  'Soundtracks'
]

async function fetchProducts() {
  loading.value = true
  const querySnapshot = await getDocs(collection(db, 'products'))
  products.value = querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      artist: data.artist || '',
      album: data.album || '',
      stock: typeof data.stock === 'number' ? data.stock : 0,
      price: typeof data.price === 'number' ? data.price : 0,
      discount: typeof data.discount === 'number' ? data.discount : 0,
      tags: Array.isArray(data.tags) ? data.tags : []
    }
  })
  loading.value = false
}

onMounted(fetchProducts)

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  const s = search.value.toLowerCase()
  return products.value.filter(
    p =>
      p.artist.toLowerCase().includes(s) ||
      p.album.toLowerCase().includes(s)
  )
})

async function updateProduct(product) {
  savingId.value = product.id
  try {
    await updateDoc(doc(db, 'products', product.id), {
      stock: Number(product.stock) || 0,
      price: Number(product.price) || 0,
      discount: Number(product.discount) || 0,
      tags: Array.isArray(product.tags) ? product.tags : []
    })
  } catch (e) {
    alert('Error updating product: ' + e.message)
  } finally {
    savingId.value = null
  }
}

async function deleteProduct(id) {
  savingId.value = id
  try {
    await deleteDoc(doc(db, 'products', id))
    products.value = products.value.filter(p => p.id !== id)
  } catch (e) {
    alert('Error deleting product: ' + e.message)
  } finally {
    savingId.value = null
  }
}
</script>
