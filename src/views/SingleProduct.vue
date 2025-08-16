<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">{{ product.title }}</h1>
    <img :src="product.image" alt="" class="w-64 h-64 object-cover mb-4 rounded shadow" />
    <p class="mb-2">Price: {{ product.price }} USD</p>
    <p class="mb-6">This is where product details will go once we connect Firebase.</p>
    <router-link to="/shop" class="text-blue-500 hover:underline">← Back to Shop</router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Temporary placeholder: would fetch from Firebase later
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

const product = products.find(p => p.id === parseInt(route.params.id))
</script>
