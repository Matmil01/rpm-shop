<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8">Fårking Forside</h1>

    <div v-for="category in categories" :key="category" class="mb-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ category }}</h2>
        <router-link :to="`/shop?tag=${encodeURIComponent(category)}`" class="text-blue-600 hover:underline">
          See all
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in productsByCategory(category)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import ProductCard from '@/components/ProductCard.vue'

const categories = [
  'Staff Favorite',
  'Bestsellers',
  'New Arrivals',
  'Rare Finds',
  'Under 100,-',
  'Soundtracks'
]

const allProducts = ref([])

async function fetchProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'))
  allProducts.value = querySnapshot.docs.map(doc => {
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

function productsByCategory(category) {
  return allProducts.value
    .filter(p => p.tags && p.tags.includes(category))
    .slice(0, 4)
}
</script>
