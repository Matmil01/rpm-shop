<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-8">Full Shop</h1>
    <input
      v-model="search"
      type="text"
      placeholder="Search by artist or album..."
      class="mb-6 w-full border rounded px-3 py-2"
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :id="product.id"
        :album="product.album || ''"
        :artist="product.artist || ''"
        :coverImage="product.coverImage || ''"
        :price="Number(product.price) || 0"
        :discount="Number(product.discount) || 0"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const products = ref([])
const search = ref('')

async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'))
  products.value = querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      album: data.album || '',
      artist: data.artist || '',
      coverImage: data.coverImage || '',
      price: typeof data.price === 'number' ? data.price : 0,
      discount: typeof data.discount === 'number' ? data.discount : 0,
      tags: Array.isArray(data.tags) ? data.tags : []
    }
  })
}

onMounted(fetchProducts)

const tag = computed(() => route.query.tag)
const filteredProducts = computed(() => {
  let filtered = tag.value
    ? products.value.filter(p => p.tags && p.tags.includes(tag.value))
    : products.value
  if (search.value) {
    const s = search.value.toLowerCase()
    filtered = filtered.filter(
      p =>
        p.artist.toLowerCase().includes(s) ||
        p.album.toLowerCase().includes(s)
    )
  }
  return filtered
})
</script>
