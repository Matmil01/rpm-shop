<template>
  <nav class="bg-black text-white px-6 py-4 flex justify-between items-center">
    <!-- Left side: Logo / Home -->
    <router-link to="/" class="text-2xl font-bold tracking-widest hover:text-red-500">
      ⚡ RPM SHOP ⚡
    </router-link>

    <!-- Center: Links -->
    <div class="space-x-6">
      <router-link to="/shop" class="hover:text-red-500">Full Shop</router-link>
      <router-link to="/misc" class="hover:text-red-500">Misc</router-link>
    </div>

    <!-- Right side: Icons -->
    <div class="space-x-4 flex items-center">
      <!-- Wishlist -->
      <router-link to="/user/wishlist" class="hover:text-red-500">♡</router-link>

      <!-- Cart -->
      <router-link to="/cart" class="hover:text-red-500">🛒</router-link>

      <!-- Login -->
      <router-link to="/login" class="hover:text-red-500">Login</router-link>
    </div>
  </nav>
</template>
