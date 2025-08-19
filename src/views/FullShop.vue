<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-8">Full Shop</h1>
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
  { id: 1, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 2, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 3, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 4, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 5, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 6, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 7, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 },
  { id: 8, title: 'Paranoid', artist: 'Black Sabbath', image: 'https://pure-music.co.uk/wp-content/uploads/2019/09/Paranoid-album-cover.png', price: 399 }
]
</script>
