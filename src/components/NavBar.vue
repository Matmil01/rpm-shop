<template>
  <nav class="bg-MyBlack text-MyWhite font-main border-b-1 border-MyDark">
    <div class="container mx-auto px-4 flex justify-between items-center py-4">
      <!-- Left: Logo / Home -->
      <router-link to="/" class="flex items-center group">
        <img
          src="/rpm-logo-white.svg"
          alt="RPM Logo"
          :style="{ transform: `rotate(${logoAngle}deg)` }"
          class="h-10 w-auto"
          @mouseenter="startSpin"
          @mouseleave="stopSpin"
        />
        <span class="ml-3 text-2xl font-logo">RPM Shop</span>
      </router-link>

      <!-- Center: Links + Dropdowns + Search -->
      <div class="flex flex-row gap-8 justify-center items-center">
        <!-- Artists Dropdown -->
        <div class="relative group">
          <router-link
            to="/shop"
            class="hover:opacity-70 font-medium text-xl cursor-pointer flex items-center transition-opacity"
          >
            Artists
          </router-link>
          <div
            class="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-MyBlack rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
          >
            <ul class="py-2 text-MyWhite">
              <li>
                <router-link to="/shop?search=Black Sabbath" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Black Sabbath</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Ozzy Osbourne" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Ozzy Osbourne</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Lorna Shore" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Lorna Shore</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Marilyn Manson" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Marilyn Manson</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Nine Inch Nails" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Nine Inch Nails</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Insomnium" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Insomnium</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Rammstein" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Rammstein</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Slaughter to Prevail" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Slaughter to Prevail</router-link>
              </li>
              <li>
                <router-link to="/shop?search=Tim Skold" class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity">Tim Skold</router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- Categories Dropdown -->
        <div class="relative group">
          <span class="hover:opacity-70 font-medium text-xl cursor-pointer flex items-center transition-opacity">
            Categories
          </span>
          <div
            class="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-MyBlack rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
          >
            <ul class="py-2 text-MyWhite">
              <li v-for="category in categories" :key="category">
                <router-link
                  :to="`/shop?tag=${encodeURIComponent(category)}`"
                  class="block px-4 py-2 font-main cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {{ category }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <router-link to="/contact" class="hover:opacity-70 font-medium text-xl cursor-pointer transition-opacity">
          Contact
        </router-link>

        <!-- Search Field -->
        <form @submit.prevent="onSearch" class="ml-4">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search by artist or album..."
            class="border border-MyDark rounded px-3 py-2 text-MyWhite bg-MyBlack font-main w-64"
          />
        </form>
      </div>

      <!-- Right: Icons -->
      <div class="space-x-4 flex items-center">
        <div class="relative group">
          <router-link to="/user/cart" class="hover:opacity-70 flex items-center transition-opacity">
            <img
              src="/Icons/cartIcon.svg"
              alt="Cart"
              class="w-6 h-6"
            />
          </router-link>
          <span
            v-if="cart.items.length"
            class="absolute -top-2 -right-3 bg-MyRed text-MyWhite rounded-full px-2 text-xs font-bold transition-all"
          >
            {{ cart.items.length }}
          </span>
          <!-- Dropdown -->
          <div
            v-if="cart.items.length"
            class="absolute right-0 mt-2 w-72 bg-MyBlack rounded shadow-lg border border-MyDark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
          >
            <div class="p-4">
              <div v-for="item in cart.items.slice(0, 3)" :key="item.id" class="flex items-center mb-3 relative">
                <img :src="item.coverImage" alt="" class="w-10 h-10 rounded mr-2" />
                <div class="flex-1">
                  <div class="font-bold text-sm">{{ item.album }}</div>
                  <div class="text-xs text-MyWhite">{{ item.artist }}</div>
                  <div class="text-xs text-MyWhite">x{{ item.quantity }}</div>
                </div>
                <button
                  @click.stop="cart.removeFromCart(item.id)"
                  class="text-MyRed p-1 absolute top-0 right-0 cursor-pointer"
                  title="Remove from cart"
                >
                  x
                </button>
              </div>
              <div v-if="cart.items.length > 3" class="text-xs text-MyWhite mb-2">
                +{{ cart.items.length - 3 }} more...
              </div>
              <div class="flex justify-between items-center font-bold text-sm mb-2">
                <span>{{ cart.items.length }} items</span>
                <span>Total: {{ calculateTotalPrice(cart.items) }} kr.</span>
              </div>
              <router-link to="/user/cart" class="block mt-2 text-center bg-MyDark text-MyWhite rounded px-4 py-2 hover:bg-gray-700 transition">
                Go to Cart
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="userStore.loggedIn" class="flex items-center gap-2">
          <div class="relative group">
            <router-link
              v-if="userStore.role === 'admin'"
              to="/admin"
              class="flex items-center"
            >
              <img
                v-if="userStore.profilePic"
                :src="userStore.profilePic"
                alt="Profile"
                class="w-10 h-10 rounded-full object-cover border-2 border-gray-600 cursor-pointer transition-opacity hover:opacity-80"
              />
              <img
                v-else
                src="/Icons/userDefault.svg"
                alt="Profile"
                class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-pointer transition-opacity hover:opacity-80"
              />
            </router-link>
            <template v-else>
              <img
                v-if="userStore.profilePic"
                :src="userStore.profilePic"
                alt="Profile"
                class="w-10 h-10 rounded-full object-cover border-2 border-gray-600 cursor-default transition-opacity"
              />
              <img
                v-else
                src="/Icons/userDefault.svg"
                alt="Profile"
                class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-default transition-opacity"
              />
            </template>
            <!-- Dropdown for profile, wishlist, and logout -->
            <div class="absolute right-0 mt-2 w-40 bg-black/95 rounded shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div class="p-4 flex flex-col items-center">
                <span class="font-bold text-MyWhite mb-2">{{ userStore.username }}</span>
                <router-link
                  :to="userStore.role === 'admin' ? '/admin/profile' : '/user/profile'"
                  class="block w-full text-center bg-gray-800 text-MyWhite rounded px-4 py-2 mb-2 hover:bg-gray-700 transition font-main cursor-pointer"
                >
                  Edit Profile
                </router-link>
                <router-link
                  :to="userStore.role === 'admin' ? '/admin/wishlist' : '/user/wishlist'"
                  class="block w-full text-center bg-gray-800 text-MyWhite rounded px-4 py-2 mb-2 hover:bg-gray-700 transition font-main cursor-pointer"
                >
                  Wishlist
                </router-link>
                <button @click="logout" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900 transition font-main cursor-pointer w-full">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <router-link to="/login" class="hover:text-MyRed">Login</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

const router = useRouter()
const searchInput = ref('')
const cart = useCartStore()
const { calculateTotalPrice } = usePriceCalculator()
const userStore = useUserStore()

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

const logoAngle = ref(0)
let spinning = false
let frameId = null
let lastTimestamp = null

const SPIN_SPEED = 180

function spinStep(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp
  const delta = timestamp - lastTimestamp
  lastTimestamp = timestamp
  logoAngle.value += (delta / 1000) * SPIN_SPEED
  logoAngle.value %= 360
  if (spinning) frameId = requestAnimationFrame(spinStep)
}

function startSpin() {
  if (!spinning) {
    spinning = true
    lastTimestamp = null
    frameId = requestAnimationFrame(spinStep)
  }
}

function stopSpin() {
  spinning = false
  if (frameId) cancelAnimationFrame(frameId)
  frameId = null
  lastTimestamp = null
}

function logout() {
  signOut(auth)
  userStore.clearUser()
  router.push('/login')
}
</script>
