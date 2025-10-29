<template>
  <!-- Main navigation bar -->
  <nav class="text-MyYellow font-main">
    <div class="container mx-auto px-4">
      <div
        class="bg-MyDark rounded-3xl shadow-MyYellow shadow flex flex-col gap-3 md:flex-row md:justify-between md:items-center py-4 px-4">
        <!-- Top row: logo and icons (mobile layout) -->
        <div class="flex justify-between items-center md:contents">
          <!-- Logo/Home link with spin animation on hover -->
          <router-link to="/" class="flex items-center group md:order-1">
            <img src="/rpm-logo-white.svg" alt="RPM Logo" :style="{ transform: `rotate(${logoAngle}deg)` }"
              class="h-10 w-auto" @mouseenter="startSpin" @mouseleave="stopSpin" />
            <span class="ml-3 text-2xl font-headline">RPM Shop</span>
          </router-link>

          <!-- Right side: cart, user, login icons and dropdowns -->
          <div class="space-x-4 flex items-center md:order-3">
            <!-- Cart icon and dropdown -->
            <div class="relative group">
              <router-link to="/user/cart"
                class="hover:opacity-70 flex items-center transition duration-200 ease-in-out">
                <img src="/icons/cartIcon.svg" alt="Cart" class="w-6 h-6" />
              </router-link>
              <!-- Cart item count badge -->
              <span v-if="cart.items.length"
                class="absolute -top-2 -right-3 bg-MyRed text-MyYellow rounded-full px-2 text-xs font-bold transition-all">
                {{ cart.items.length }}
              </span>
              <CartDropdown />
            </div>

            <!-- User profile and dropdown (if logged in) -->
            <div v-if="userStore.loggedIn" class="flex items-center gap-2">
              <div class="relative group" ref="userMenuEl">
                <!-- Admin: desktop link, mobile toggle -->
                <template v-if="userStore.role === 'admin'">
                  <router-link to="/admin" class="hidden md:flex items-center">
                    <img :key="`profilePic-${userStore.uid}-${profilePicSrc}`" :src="profilePicSrc" alt="Profile"
                      class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-pointer transition-opacity hover:opacity-70 object-cover"
                      @error="onProfilePicError" />
                  </router-link>
                  <button class="flex md:hidden items-center" @click.stop="toggleUserMenu" aria-haspopup="menu"
                    :aria-expanded="userMenuOpen">
                    <img :key="`profilePic-m-${userStore.uid}-${profilePicSrc}`" :src="profilePicSrc" alt="Profile"
                      class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 transition-opacity object-cover"
                      @error="onProfilePicError" />
                  </button>
                </template>

                <!-- Non-admin: desktop image, mobile toggle -->
                <template v-else>
                  <img :key="`profilePic-${userStore.uid}-${profilePicSrc}`" :src="profilePicSrc" alt="Profile"
                    class="hidden md:block w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-default transition-opacity object-cover"
                    @error="onProfilePicError" />
                  <button class="md:hidden flex items-center" @click.stop="toggleUserMenu" aria-haspopup="menu"
                    :aria-expanded="userMenuOpen">
                    <img :key="`profilePic-m-${userStore.uid}-${profilePicSrc}`" :src="profilePicSrc" alt="Profile"
                      class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 transition-opacity object-cover"
                      @error="onProfilePicError" />
                  </button>
                </template>

                <!-- User dropdown: opens on hover (desktop) or toggle (mobile) -->
                <UserDropdown :open="userMenuOpen" @logout="logout" />
              </div>
            </div>

            <!-- Login icon (if not logged in) -->
            <div v-else>
              <router-link to="/login" class="hover:opacity-70 transition ease-in-out duration-200">
                <img src="/icons/loginIcon.svg" alt="Login" class="w-6 h-6" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Center: search field for artist/album -->
        <form @submit.prevent="onSearch"
          class="w-full md:flex-1 md:mx-8 flex items-center gap-2 mt-1 md:mt-0 md:order-2">
          <input v-model="searchInput" type="text" placeholder="Search by artist or album..."
            class="border border-MyYellow rounded-3xl px-3 py-2 text-MyWhite font-main w-full" />
          <SimpleButton type="submit" class="ml-2">
            Search
          </SimpleButton>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useSpinAnimation } from '@/composables/useSpinAnimation'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import CartDropdown from '@/components/user/CartDropdown.vue'
import UserDropdown from '@/components/user/UserDropdown.vue'
import { useProfilePic } from '@/composables/user/useProfilePic'

// Router instance for navigation
const router = useRouter()
// Search input for search field
const searchInput = ref('')
// Cart and user stores
const cart = useCartStore()
const userStore = useUserStore()
// Spin animation for logo
const { angle: logoAngle, startSpin, stopSpin } = useSpinAnimation(180)

// State for user dropdown menu
const userMenuOpen = ref(false)
const userMenuEl = ref(null)

// Profile picture logic
const { profilePicSrc, DEFAULT_PROFILE_PIC } = useProfilePic()

// Handles profile picture load errors (fallback to default)
function onProfilePicError(e) {
  const img = e?.target
  if (img && img.tagName === 'IMG' && !img.src.endsWith(DEFAULT_PROFILE_PIC)) {
    img.src = DEFAULT_PROFILE_PIC
  }
}

// Mount/unmount: add/remove global click and escape listeners for dropdown
onMounted(() => {
  document.addEventListener('click', onGlobalClick)
  document.addEventListener('keydown', onEsc)
})

onUnmounted(() => {
  document.removeEventListener('click', onGlobalClick)
  document.removeEventListener('keydown', onEsc)
})

// Toggle user dropdown menu
function toggleUserMenu() { userMenuOpen.value = !userMenuOpen.value }
function closeUserMenu() { userMenuOpen.value = false }
// Close dropdown if click outside
function onGlobalClick(e) {
  if (userMenuOpen.value && userMenuEl.value && !userMenuEl.value.contains(e.target)) closeUserMenu()
}
// Close dropdown on Escape key
function onEsc(e) { if (e.key === 'Escape') closeUserMenu() }

// Handles search form submission
function onSearch() {
  if (searchInput.value.trim()) router.push({ path: '/shop', query: { search: searchInput.value.trim() } })
  else router.push({ path: '/shop' })
}

// Handles logout: sign out and clear user, then redirect to login
function logout() {
  signOut(auth)
  userStore.clearUser?.()
  router.push('/login')
}
</script>
