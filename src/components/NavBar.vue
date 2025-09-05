<template>
  <nav class="bg-black text-MyWhite font-main px-6 py-4 flex justify-between items-center border-b-4 border-gray-600">
    <!-- Left: Logo / Home -->
    <router-link to="/" class="flex items-center">
      <img
        src="/rpm-logo-white.svg"
        alt="RPM Logo"
        class="h-10 w-auto transition-transform duration-200 hover:scale-110"
      />
      <span class="ml-3 text-2xl font-headline">RPM Shop</span>
    </router-link>

    <!-- Center: Links -->
    <div class="space-x-6">
      <router-link to="/shop" class="hover:text-red-500">Full Shop</router-link>
      <router-link to="/misc" class="hover:text-red-500">Misc</router-link>
    </div>

    <!-- Right: Icons -->
    <div class="space-x-4 flex items-center">
      <router-link to="/user/wishlist" class="hover:text-red-500">♡</router-link>
      <router-link to="/user/cart" class="hover:text-red-500">🛒</router-link>
      <router-link to="/admin" class="hover:text-red-500">Login</router-link>
    </div>
  </nav>
</template>
