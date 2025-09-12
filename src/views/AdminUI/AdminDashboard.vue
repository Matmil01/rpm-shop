<template>
  <div class="flex flex-col items-center justify-center min-h-[300px] font-main text-MyWhite">
    <h2 class="text-3xl font-bold mb-4 pt-10">Hello, Admin</h2>
    <p class="mb-6 text-lg text-gray-300">Use this interface to add new records, manage the storefront, and steal people's money. Hail Satan.</p>
    <div class="flex gap-20 pt-10">
      <div class="flex flex-col items-center">
        <router-link to="/admin/add" class="group">
          <img src="/Icons/addRecord.svg" alt="Add Record" class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity" />
        </router-link>
        <span class="mt-1 text-lg font-semibold">Add Record</span>
      </div>
      <div class="flex flex-col items-center">
        <router-link to="/admin/manage" class="group">
          <img src="/Icons/manageDatabase.svg" alt="Manage Records" class="w-24 h-24 md:w-32 md:h-32 mx-auto group-hover:opacity-70 transition-opacity" />
        </router-link>
        <span class="mt-1 text-lg font-semibold">Manage Database</span>
      </div>
      <div class="flex flex-col items-center">
        <img src="/Icons/manageUsers.svg" alt="Manage Users" class="w-24 h-24 md:w-32 md:h-32 mx-auto opacity-60" />
        <span class="mt-1 text-lg font-semibold text-gray-400 text-center">
          Manage Users<br>(coming soon, maybe, I don't know)
        </span>
      </div>
    </div>
  </div>

</template>
