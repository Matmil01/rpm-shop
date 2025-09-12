<template>
  <div class="p-6 flex flex-col items-center">
    <nav class="flex gap-4 mb-6 justify-center">
      <router-link to="/admin" class="font-main text-MyWhite hover:text-red-500">Return to Dashboard</router-link>
      <router-link to="/admin/add" class="font-main text-MyWhite hover:text-red-500">Add Records</router-link>
      <router-link to="/admin/manage" class="font-main text-MyWhite hover:text-red-500">Manage Storefront</router-link>
    </nav>

    <router-view />
  </div>
</template>
