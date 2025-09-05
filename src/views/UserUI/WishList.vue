<!-- Mockup for wishlist -->

<template>
  <div class="max-w-4xl mx-auto p-8 font-main text-MyWhite">
    <h1 class="text-3xl font-bold mb-8">Your Wishlist</h1>
    <div v-if="wishlist.length === 0" class="text-gray-400 text-lg">
      Your wishlist is empty. Click the ♡ icon on any record or item to add it here!
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="item in wishlist"
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
        <div class="mb-2">
          <span class="underline hover:text-blue-400">
            {{ item.artist || item.brand }}
          </span>
        </div>
        <div class="text-blue-700 font-bold mb-2">
          {{ item.price }} kr.
        </div>
        <button
          @click="removeFromWishlist(item.id)"
          class="text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const wishlist = ref([
  {
    id: '1',
    album: 'Album Name',
    artist: 'Artist Name',
    coverImage: 'https://marilynmanson.com/assets/OAUG.jpg',
    price: 349
  },
  {
    id: '2',
    name: 'RPM Shop Hoodie',
    brand: 'RPM Merch',
    image: 'https://store.marilynmanson.com/cdn/shop/files/hoodie_f.png?v=1732236242',
    price: 199
  }
])

function removeFromWishlist(id) {
  wishlist.value = wishlist.value.filter(item => item.id !== id)
}
</script>
