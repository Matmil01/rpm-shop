<template>
  <nav class="bg-black text-MyWhite font-main px-6 py-4 flex justify-between items-center border-b-4 border-gray-600">
    <!-- Left: Logo / Home -->
    <router-link to="/" class="flex items-center">
      <img
        src="/rpm-logo-white.svg"
        alt="RPM Logo"
        class="h-10 w-auto transition-transform duration-200 hover:scale-110"
      />
      <span class="ml-3 text-2xl font-logo">RPM Shop</span>
    </router-link>

    <!-- Center: Links + Dropdowns + Search -->
    <div class="flex flex-row gap-8 justify-center items-center">
      <!-- Artists Dropdown -->
      <div class="relative group">
        <router-link
          to="/shop"
          class="hover:text-red-500 font-medium cursor-pointer flex items-center"
        >
          Artists
        </router-link>
        <div
          class="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-MyBlack rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
        >
          <ul class="py-2 text-MyWhite">
            <li>
              <router-link to="/shop?search=Black Sabbath" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Black Sabbath</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Ozzy Osbourne" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Ozzy Osbourne</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Lorna Shore" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Lorna Shore</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Marilyn Manson" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Marilyn Manson</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Nine Inch Nails" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Nine Inch Nails</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Insomnium" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Insomnium</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Rammstein" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Rammstein</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Slaughter to Prevail" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Slaughter to Prevail</router-link>
            </li>
            <li>
              <router-link to="/shop?search=Tim Skold" class="block px-4 py-2 font-main cursor-pointer hover:text-red-500">Tim Skold</router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Categories Dropdown -->
      <div class="relative group">
        <span class="hover:text-red-500 font-medium cursor-pointer flex items-center">
          Categories
        </span>
        <div
          class="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-MyBlack rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
        >
          <ul class="py-2 text-MyWhite">
            <li v-for="category in categories" :key="category">
              <router-link
                :to="`/shop?tag=${encodeURIComponent(category)}`"
                class="block px-4 py-2 font-main cursor-pointer hover:text-red-500"
              >
                {{ category }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <router-link to="/contact" class="hover:text-red-500 font-medium cursor-pointer">
        Contact
      </router-link>

      <!-- Search Input -->
      <form @submit.prevent="onSearch" class="ml-4">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search by artist or album..."
          class="border border-gray-600 rounded px-3 py-2 text-MyWhite bg-black font-main w-64"
        />
      </form>
    </div>

    <!-- Right: Icons -->
    <div class="space-x-4 flex items-center">
      <router-link to="/user/wishlist" class="hover:text-red-500">♡</router-link>
      <div class="relative group">
        <router-link to="/user/cart" class="hover:text-red-500 text-2xl">🛒</router-link>
        <span
          v-if="cart.items.length"
          class="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-2 text-xs font-bold transition-all"
        >
          {{ cart.items.length }}
        </span>
        <!-- Dropdown -->
        <div
          v-if="cart.items.length"
          class="absolute right-0 mt-2 w-72 bg-black/95 rounded shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
        >
          <div class="p-4">
            <div v-for="item in cart.items.slice(0, 3)" :key="item.id" class="flex items-center mb-3">
              <img :src="item.coverImage" alt="" class="w-10 h-10 rounded mr-2" />
              <div>
                <div class="font-bold text-sm">{{ item.album }}</div>
                <div class="text-xs text-gray-300">{{ item.artist }}</div>
                <div class="text-xs text-gray-400">x{{ item.quantity }}</div>
              </div>
            </div>
            <div v-if="cart.items.length > 3" class="text-xs text-gray-400 mb-2">
              +{{ cart.items.length - 3 }} more...
            </div>
            <router-link to="/user/cart" class="block mt-2 text-center bg-MyRed text-white rounded px-4 py-2 hover:bg-red-700 transition">
              Go to Cart
            </router-link>
          </div>
        </div>
      </div>
      <router-link to="/admin" class="hover:text-red-500">Login</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'

const router = useRouter()
const searchInput = ref('')
const cart = useCartStore()

const categories = [
  // 'Soundtracks',
  // 'Staff Favorites',
  'Special Offers',
  'New Arrivals',
  // 'Japan Imports',
  'Rare Finds',
  // 'Doom & Gloom',
  // 'Shock & Awe',
  // 'Dad Metal',
  // 'Avant Garde'
]

function onSearch() {
  if (searchInput.value.trim()) {
    router.push({ path: '/shop', query: { search: searchInput.value.trim() } })
  } else {
    router.push({ path: '/shop' })
  }
}
</script>
