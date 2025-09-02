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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const search = ref('')

const { products, listenToProducts, unsubscribeProducts } = useFirestoreCRUD()

onMounted(() => {
  listenToProducts()
})
onUnmounted(() => {
  if (unsubscribeProducts) unsubscribeProducts()
})

// Sync search box with ?search= query param
watch(
  () => route.query.search,
  (val) => {
    if (typeof val === 'string') search.value = val
  },
  { immediate: true }
)

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
