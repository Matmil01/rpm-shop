<template>
  <div class="flex flex-col items-center justify-center min-h-[300px]">
    <h2 class="text-3xl font-bold mb-4">Hello, Admin</h2>
    <p class="mb-6 text-lg text-gray-700">Use this interface to add new records, manage the storefront, and steal people's money. Hail Satan.</p>
    <div class="flex gap-4">
      <router-link
        to="/admin/add"
        class="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 font-semibold transition"
      >
        Add Product
      </router-link>
      <router-link
        to="/admin/manage"
        class="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 font-semibold transition"
      >
        Manage Products
      </router-link>
    </div>
  </div>
</template>
