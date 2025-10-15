<template>
  <div
    :class="[
      'absolute right-0 mt-2 w-40 bg-MyBlack rounded-3xl shadow shadow-MyYellow transition-all z-50',
      open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none',
      'md:group-hover:opacity-100 md:group-hover:visible md:pointer-events-auto'
    ]"
  >
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
        to="/user/wishlist"
        class="block w-full text-center text-MyYellow hover:opacity-70 transition duration-200 ease-in-out font-main cursor-pointer mb-2"
      >
        Wishlist
      </router-link>
      <router-link
        to="/user/orders"
        class="block w-full text-center text-MyYellow hover:opacity-70 transition duration-200 ease-in-out font-main cursor-pointer mb-2"
      >
        Order History
      </router-link>
      <hr class="border-t border-gray-700 w-full mb-2" />
      <span
        @click="$emit('logout')"
        class="block w-full text-center text-MyYellow hover:text-MyRed transition duration-200 ease-in-out font-main cursor-pointer mb-2"
        style="cursor:pointer;"
      >
        Logout
      </span>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/composables/piniaStores/userStore'

defineProps({
  open: { type: Boolean, default: false }
})

const userStore = useUserStore()
</script>
