<template>
  <div class="p-6 flex flex-col items-center font-main text-MyWhite">
    <nav class="flex gap-4 mb-6 justify-center">
      <router-link to="/admin" class="underline text-MyWhite hover:text-blue-400">Return to Dashboard</router-link>
      <router-link to="/admin/add" class="underline text-MyWhite hover:text-blue-400">Add Records</router-link>
      <router-link to="/admin/manage" class="underline text-MyWhite hover:text-blue-400">Manage Storefront</router-link>
    </nav>

    <router-view />
  </div>
</template>
