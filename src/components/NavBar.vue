<template>
  <nav class="text-MyYellow font-main">
    <div class="container mx-auto px-4">
      <div class="bg-MyDark rounded-3xl shadow-MyYellow shadow flex justify-between items-center py-4 px-4">
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
          <span class="ml-3 text-2xl font-headline">RPM Shop</span>
        </router-link>

        <!-- Center: Expanded Search Field -->
        <form @submit.prevent="onSearch" class="flex-1 mx-8 flex items-center gap-2">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search by artist or album..."
            class="border border-MyYellow rounded-3xl px-3 py-2 text-MyWhite font-main w-full"
          />
          <SimpleButton type="submit" class="ml-2">
            Search
          </SimpleButton>
        </form>

        <!-- Right: icons and user dropdown -->
        <div class="space-x-4 flex items-center">
          <div class="relative group">
            <router-link to="/user/cart" class="hover:opacity-70 flex items-center transition duration-200 ease-in-out">
              <img
                src="/icons/cartIcon.svg"
                alt="Cart"
                class="w-6 h-6"
              />
            </router-link>
            <span
              v-if="cart.items.length"
              class="absolute -top-2 -right-3 bg-MyRed text-MyYellow rounded-full px-2 text-xs font-bold transition-all"
            >
              {{ cart.items.length }}
            </span>
            <!-- Dropdown -->
            <div
              v-if="cart.items.length"
              class="absolute right-0 mt-2 w-72 bg-MyBlack rounded-3xl shadow shadow-MyYellow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
            >
              <div class="p-4">
                <div v-for="item in cart.items.slice(0, 3)" :key="item.id" class="flex items-center mb-3 relative bg-MyBlack p-2 rounded">
                  <img :src="item.coverImage" alt="" class="w-10 h-10 rounded mr-2" />
                  <div class="flex-1">
                    <div class="font-bold text-sm text-white">{{ item.album }}</div>
                    <div class="text-xs text-MyWhite">{{ item.artist }}</div>
                    <div class="text-xs text-MyWhite">x{{ item.quantity }}</div>
                  </div>
                  <TrashButton
                    title="Remove from cart"
                    alt="Remove"
                    class="absolute top-0 right-0 p-1"
                    :disabled="false"
                    @click.stop="cart.removeFromCart(item.id)"
                  />
                </div>
                <div v-if="cart.items.length > 3" class="text-xs text-MyWhite mb-2">
                  +{{ cart.items.length - 3 }} more...
                </div>
                <div class="flex justify-between items-center font-bold text-sm text-MyWhite mb-2">
                  <span>{{ cart.items.length }} items</span>
                  <span>Total: {{ calculateTotalPrice(cart.items) }} kr.</span>
                </div>
                <SimpleButton
                  to="/user/cart"
                  class="w-full mt-2"
                >
                  Go to Cart
                </SimpleButton>
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
                  src="/avatars/userDefault.svg"
                  alt="Profile"
                  class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-pointer transition-opacity hover:opacity-70"
                />
              </router-link>
              <template v-else>
                <img
                  src="/avatars/userDefault.svg"
                  alt="Profile"
                  class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-default transition-opacity"
                />
              </template>
              <!-- Dropdown for profile, wishlist, and logout -->
              <div class="absolute right-0 mt-2 w-40 bg-MyBlack rounded-3xl shadow shadow-MyYellow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div class="p-4 flex flex-col items-center">
                  <span class="font-bold text-MyYellow mb-2">{{ userStore.username }}</span>
                  <hr class="border-t border-gray-700 w-full mb-2" />
                  <router-link
                    :to="userStore.role === 'admin' ? '/admin/profile' : '/user/profile'"
                    class="block w-full text-center text-MyYellow hover:opacity-70 transition duration-200 ease-in-out font-main cursor-pointer mb-2"
                  >
                    Edit Profile
                  </router-link>
                  <router-link
                    :to="userStore.role === 'admin' ? '/admin/wishlist' : '/user/wishlist'"
                    class="block w-full text-center text-MyYellow hover:opacity-70 transition duration-200 ease-in-out font-main cursor-pointer mb-2"
                  >
                    Wishlist
                  </router-link>
                  <hr class="border-t border-gray-700 w-full mb-2" />
                  <span
                    @click="logout"
                    class="block w-full text-center text-MyYellow hover:text-MyRed transition duration-200 ease-in-out font-main cursor-pointer mb-2"
                    style="cursor:pointer;"
                  >
                    Logout
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <router-link to="/login" class="hover:opacity-70 transition ease-in-out duration-200">
              <img src="/icons/loginIcon.svg" alt="Login" class="w-6 h-6" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import TrashButton from '@/components/TrashButton.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'
import { useUserStore } from '@/composables/piniaStores/userStore'
import SimpleButton from '@/components/SimpleButton.vue'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

const router = useRouter()
const searchInput = ref('')
const cart = useCartStore()
const { calculateTotalPrice } = usePriceCalculator()
const userStore = useUserStore()

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
