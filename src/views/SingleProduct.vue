<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-1">{{ product.title }}</h1>
    <div class="text-lg text-gray-700 mb-4">{{ product.artist }}</div>
    <img :src="product.image" alt="" class="w-64 h-64 object-cover mb-4 rounded shadow" />
    <p class="mb-2">Price: {{ product.price }} kr.</p>
    <p class="mb-2">Speed: 33 RPM</p>
    <p class="mb-2">Size: 12"</p>
    <p class="mb-2">Stock: {{ stock }}</p>
    <router-link to="/shop" class="text-blue-500 hover:underline">← Back to Shop</router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

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

const product = products.find(p => p.id === parseInt(route.params.id))
const stock = Math.floor(Math.random() * 10) + 1
</script>
