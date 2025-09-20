<template>
  <div class="p-6 flex flex-col items-center">
    <nav class="flex gap-20 pt-10 justify-center">
      <!-- Return to Dashboard -->
      <router-link to="/admin" class="flex flex-col items-center group">
        <img src="/Icons/manageOrders.svg" alt="Dashboard" class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity" />
        <span class="mt-4 text-xl font-main text-MyWhite">Return to Dashboard</span>
      </router-link>
      <!-- Add Record -->
      <router-link to="/admin/add" class="flex flex-col items-center group">
        <img src="/Icons/addRecord.svg" alt="Add Record" class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity" />
        <span class="mt-4 text-xl font-main text-MyWhite">Add Record</span>
      </router-link>
      <!-- Manage Storefront -->
      <router-link to="/admin/manage" class="flex flex-col items-center group">
        <img src="/Icons/manageDatabase.svg" alt="Manage Storefront" class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity" />
        <span class="mt-4 text-xl font-main text-MyWhite">Manage Storefront</span>
      </router-link>
      <!-- Manage Users -->
      <router-link to="/admin/users" class="flex flex-col items-center group">
        <img src="/Icons/manageUsers.svg" alt="Manage Users" class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity" />
        <span class="mt-4 text-xl font-main text-MyWhite">Manage Users</span>
      </router-link>
    </nav>
    <router-view />
  </div>
</template>
