<template>
  <div class="p-6 flex flex-col items-center">
    <nav class="flex gap-4 mb-6 justify-center">
      <router-link to="/admin" class="underline">Return to Dashboard</router-link>
      <router-link to="/admin/add" class="underline">Add Products</router-link>
      <router-link to="/admin/manage" class="underline">Manage Storefront</router-link>
    </nav>

    <router-view />
  </div>
</template>
