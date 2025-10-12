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

        <!-- Center: Search Field -->
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

        <!-- Right: icons and dropdowns -->
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
            <CartDropdown />
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
              <UserDropdown @logout="logout" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useSpinAnimation } from '@/composables/useSpinAnimation'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import CartDropdown from '@/components/user/CartDropdown.vue'
import UserDropdown from '@/components/user/UserDropdown.vue'

const router = useRouter()
const searchInput = ref('')
const cart = useCartStore()
const { calculateTotalPrice } = usePriceCalculator()
const userStore = useUserStore()
const { angle: logoAngle, startSpin, stopSpin } = useSpinAnimation(180)

function onSearch() {
  if (searchInput.value.trim()) {
    router.push({ path: '/shop', query: { search: searchInput.value.trim() } })
  } else {
    router.push({ path: '/shop' })
  }
}

function logout() {
  signOut(auth)
  userStore.clearUser()
  router.push('/login')
}
</script>
