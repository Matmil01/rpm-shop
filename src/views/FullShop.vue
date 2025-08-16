<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-8">All Vinyl Records</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        v-bind="product"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue'

const products = [
  { id: 1, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 25 },
  { id: 2, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 30 },
  { id: 3, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 28 },
  { id: 4, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 28 },
  { id: 5, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 28 },
  { id: 6, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 28 },
  { id: 7, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 28 },
  { id: 7, title: 'Black Sabbath – Paranoid', image: 'https://marilynmanson.com/assets/OAUG.jpg', price: 28 }
]
</script>
