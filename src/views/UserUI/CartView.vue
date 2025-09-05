<!-- Mockup for cart -->

<template>
  <div class="max-w-4xl mx-auto p-8 font-main text-MyWhite">
    <h1 class="text-3xl font-bold mb-8">Your Cart</h1>
    <div v-if="cart.length === 0" class="text-gray-400 text-lg">
      Your cart is empty. Add records or items to your cart to see them here!
    </div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
        <div
          v-for="item in cart"
          :key="item.id"
          class="bg-[url('/Texturelabs_InkPaint_368XL.jpg')] bg-repeat bg-center rounded shadow p-4 flex flex-col items-center font-main text-MyWhite"
        >
          <img
            :src="item.coverImage || item.image"
            alt="Cover"
            class="w-32 h-32 object-cover rounded mb-4"
          />
          <div class="font-semibold text-lg mb-1">
            {{ item.album || item.name }}
          </div>
          <div class="mb-2 underline hover:text-blue-400">
            {{ item.artist || item.brand }}
          </div>
          <div class="text-blue-700 font-bold mb-2">
            {{ item.price }} kr.
          </div>
          <div class="flex items-center gap-2 mb-2">
            <button
              @click="decrement(item)"
              class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-black"
              :disabled="item.quantity <= 1"
            >-</button>
            <span>{{ item.quantity }}</span>
            <button
              @click="increment(item)"
              class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-black"
            >+</button>
          </div>
          <button
            @click="removeFromCart(item.id)"
            class="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
      <div class="flex justify-end items-center mt-6">
        <div class="text-xl font-bold mr-6">
          Total: {{ totalPrice }} kr.
        </div>
        <button
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-main"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cart = ref([
  {
    id: '1',
    album: 'Album Name',
    artist: 'Artist Name',
    coverImage: 'https://marilynmanson.com/assets/OAUG.jpg',
    price: 349,
    quantity: 1
  },
  {
    id: '2',
    name: 'RPM Shop Hoodie',
    brand: 'RPM Merch',
    image: 'https://store.marilynmanson.com/cdn/shop/files/hoodie_f.png?v=1732236242',
    price: 199,
    quantity: 2
  }
])

function increment(item) {
  item.quantity++
}

function decrement(item) {
  if (item.quantity > 1) item.quantity--
}

function removeFromCart(id) {
  cart.value = cart.value.filter(item => item.id !== id)
}

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
</script>

<style>
.font-main {
  font-family: 'MainFont', sans-serif;
}

.text-MyWhite {
  color: #f8fafc;
}
</style>
