<template>
  <div class="p-6 flex flex-col items-center">
    <nav class="grid grid-cols-2 gap-x-8 gap-y-10 pt-10 place-items-center md:flex md:gap-20 md:justify-center">
      <!-- Return to Orders -->
      <router-link to="/admin" class="flex flex-col items-center group">
        <img src="/icons/manageOrders.svg" alt="Orders Icon"
          class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity ease-in-out duration-200" />
        <span class="mt-4 text-xl font-main text-MyWhite">Process Orders</span>
      </router-link>
      <!-- Manage Users -->
      <router-link to="/admin/users" class="flex flex-col items-center group">
        <img src="/icons/manageUsers.svg" alt="Users Icon"
          class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity ease-in-out duration-200" />
        <span class="mt-4 text-xl font-main text-MyWhite">Manage Users</span>
      </router-link>
      <!-- Manage Storefront -->
      <router-link to="/admin/manage" class="flex flex-col items-center group">
        <img src="/icons/manageDatabase.svg" alt="Database Icon"
          class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity ease-in-out duration-200" />
        <span class="mt-4 text-xl font-main text-MyWhite">Manage Storefront</span>
      </router-link>
      <!-- Add Record -->
      <router-link to="/admin/add" class="flex flex-col items-center group">
        <img src="/icons/addRecord.svg" alt="Add Record Icon"
          class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity ease-in-out duration-200" />
        <span class="mt-4 text-xl font-main text-MyWhite">Add Record</span>
      </router-link>
    </nav>
    <router-view />
  </div>
</template>
