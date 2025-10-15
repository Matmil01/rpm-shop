<template>
  <nav class="text-MyYellow font-main">
    <div class="container mx-auto px-4">
      <div
        class="bg-MyDark rounded-3xl shadow-MyYellow shadow flex flex-col gap-3 md:flex-row md:justify-between md:items-center py-4 px-4"
      >
        <!-- Mobile top row: Left (logo) + Right (icons) -->
        <div class="flex justify-between items-center md:contents">
          <!-- Left: Logo / Home -->
          <router-link to="/" class="flex items-center group md:order-1">
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

          <!-- Right: icons and dropdowns -->
          <div class="space-x-4 flex items-center md:order-3">
            <div class="relative group">
              <router-link to="/user/cart" class="hover:opacity-70 flex items-center transition duration-200 ease-in-out">
                <img src="/icons/cartIcon.svg" alt="Cart" class="w-6 h-6" />
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
              <div class="relative group" ref="userMenuEl">
                <!-- Admin: link on desktop, toggle on mobile -->
                <template v-if="userStore.role === 'admin'">
                  <router-link to="/admin" class="hidden md:flex items-center">
                    <img
                      :key="`avatar-${userStore.uid}-${avatarSrc}`"
                      :src="avatarSrc"
                      alt="Profile"
                      class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-pointer transition-opacity hover:opacity-70 object-cover"
                      @error="onAvatarError"
                    />
                  </router-link>
                  <button
                    class="flex md:hidden items-center"
                    @click.stop="toggleUserMenu"
                    aria-haspopup="menu"
                    :aria-expanded="userMenuOpen"
                  >
                    <img
                      :key="`avatar-m-${userStore.uid}-${avatarSrc}`"
                      :src="avatarSrc"
                      alt="Profile"
                      class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 transition-opacity object-cover"
                      @error="onAvatarError"
                    />
                  </button>
                </template>

                <!-- Non-admin -->
                <template v-else>
                  <img
                    :key="`avatar-${userStore.uid}-${avatarSrc}`"
                    :src="avatarSrc"
                    alt="Profile"
                    class="hidden md:block w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 cursor-default transition-opacity object-cover"
                    @error="onAvatarError"
                  />
                  <button
                    class="md:hidden flex items-center"
                    @click.stop="toggleUserMenu"
                    aria-haspopup="menu"
                    :aria-expanded="userMenuOpen"
                  >
                    <img
                      :key="`avatar-m-${userStore.uid}-${avatarSrc}`"
                      :src="avatarSrc"
                      alt="Profile"
                      class="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 transition-opacity object-cover"
                      @error="onAvatarError"
                    />
                  </button>
                </template>

                <!-- Dropdown: opens on hover (md+) or when userMenuOpen=true on mobile -->
                <UserDropdown :open="userMenuOpen" @logout="logout" />
              </div>
            </div>

            <div v-else>
              <router-link to="/login" class="hover:opacity-70 transition ease-in-out duration-200">
                <img src="/icons/loginIcon.svg" alt="Login" class="w-6 h-6" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Center: Search Field -->
        <form
          @submit.prevent="onSearch"
          class="w-full md:flex-1 md:mx-8 flex items-center gap-2 mt-1 md:mt-0 md:order-2"
        >
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
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'               // CHANGED: import db
import { doc, getDoc } from 'firebase/firestore'    // ADDED
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useSpinAnimation } from '@/composables/useSpinAnimation'
import SimpleButton from '@/components/buttons/SimpleButton.vue'
import CartDropdown from '@/components/user/CartDropdown.vue'
import UserDropdown from '@/components/user/UserDropdown.vue'

const router = useRouter()
const searchInput = ref('')
const cart = useCartStore()
const userStore = useUserStore()
const { angle: logoAngle, startSpin, stopSpin } = useSpinAnimation(180)

const userMenuOpen = ref(false)
const userMenuEl = ref(null)
const DEFAULT_AVATAR = '/avatars/userDefault.svg'
const avatarSrc = computed(() =>
  (typeof userStore.profilePic === 'string' && userStore.profilePic.trim()) || DEFAULT_AVATAR
)

function onAvatarError(e) {
  const img = e?.target
  if (img && img.tagName === 'IMG' && !img.src.endsWith(DEFAULT_AVATAR)) {
    img.src = DEFAULT_AVATAR
  }
}

// ADDED: load profilePic from Firestore immediately on login
async function syncProfilePicFromFirestore() {
  if (!userStore.loggedIn || !userStore.uid) return
  try {
    const snap = await getDoc(doc(db, 'users', userStore.uid))
    if (snap.exists()) {
      const data = snap.data()
      const pic = data.profilePic || data.avatarUrl || null
      if (pic && pic !== userStore.profilePic) {
        userStore.profilePic = pic
      }
    }
  } catch (_) {
    // ignore
  }
}

// OPTIONAL: backfill from Auth photoURL only if store is empty
function syncProfilePicFromAuth() {
  const authPic = auth.currentUser?.photoURL || null
  if (userStore.loggedIn && !userStore.profilePic && authPic) {
    userStore.profilePic = authPic
  }
}

watch(() => userStore.uid, async () => {
  userMenuOpen.value = false
  await syncProfilePicFromFirestore()  // ADDED
  syncProfilePicFromAuth()             // keep as fallback
})

onMounted(async () => {
  document.addEventListener('click', onGlobalClick)
  document.addEventListener('keydown', onEsc)
  await syncProfilePicFromFirestore()  // ADDED
  syncProfilePicFromAuth()
})

onUnmounted(() => {
  document.removeEventListener('click', onGlobalClick)
  document.removeEventListener('keydown', onEsc)
})

function toggleUserMenu() { userMenuOpen.value = !userMenuOpen.value }
function closeUserMenu() { userMenuOpen.value = false }
function onGlobalClick(e) {
  if (userMenuOpen.value && userMenuEl.value && !userMenuEl.value.contains(e.target)) closeUserMenu()
}
function onEsc(e) { if (e.key === 'Escape') closeUserMenu() }

function onSearch() {
  if (searchInput.value.trim()) router.push({ path: '/shop', query: { search: searchInput.value.trim() } })
  else router.push({ path: '/shop' })
}

function logout() {
  signOut(auth)
  userStore.clearUser?.()
  router.push('/login')
}
</script>
