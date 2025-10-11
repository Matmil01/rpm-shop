<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <h2 class="text-2xl font-headline mb-8">Registered Users</h2>
    <input
      v-model="search"
      type="text"
      placeholder="Search by username or email..."
      class="mb-4 w-full border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main"
    />
    <div v-if="loading" class="text-MyWhite mb-4">Fetching users...</div>

    <div v-if="filteredUsers.length" class="rounded overflow-hidden">
      <table class="w-full border-collapse border border-MyDark table-auto font-main text-MyWhite bg-MyBlack">
        <thead>
          <tr class="bg-MyDark text-center text-MyWhite font-main">
            <th class="p-2 border border-MyDark">Username</th>
            <th class="p-2 border border-MyDark">Email</th>
            <th class="p-2 border border-MyDark">Role</th>
            <th class="p-2 border border-MyDark">Orders</th>
            <th class="p-2 border border-MyDark">Date Joined</th>
            <th class="p-2 border border-MyDark">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.uid" class="border-t border-MyDark">
            <td class="p-2 border border-MyDark">{{ user.username }}</td>
            <td class="p-2 border border-MyDark">{{ user.email }}</td>
            <td class="p-2 border border-MyDark">{{ user.role }}</td>
            <td class="p-2 border border-MyDark">{{ user.orderCount || 0 }}</td>
            <td class="p-2 border border-MyDark">
              {{ user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : '—' }}
            </td>
            <td class="p-2 border border-MyDark">
              <button
                v-if="user.uid !== currentAdminUid"
                @click="deleteUser(user.uid)"
                class="bg-MyRed text-MyWhite px-3 py-1 rounded hover:opacity-70 transition ease-in-out duration-200 font-main cursor-pointer"
                :disabled="deleting === user.uid"
              >
                <span v-if="deleting === user.uid">Banning...</span>
                <span v-else>Ban</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading" class="text-MyWhite">No users found.</div>
    <div v-if="error" class="text-MyRed mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { db } from '@/firebase'
import { query, collection, getDocs, where } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useUsersCRUD } from '@/composables/CRUD/useUsersCRUD'
import { useDeleteItem } from '@/composables/useDeleteItem'
import { useTableSearch } from '@/composables/useTableSearch'

const users = ref([])
const search = ref('')
const loading = ref(true)
const userStore = useUserStore()
const currentAdminUid = userStore.uid
const { deleteItem, deletingId, error } = useDeleteItem()

const { listenToUsers } = useUsersCRUD()
let unsubscribe = null

async function addOrderCounts(userList) {
  for (const user of userList) {
    const ordersSnap = await getDocs(query(collection(db, 'orders'), where('customer.uid', '==', user.uid)))
    user.orderCount = ordersSnap.size
  }
  users.value = userList
}

onMounted(() => {
  loading.value = true
  unsubscribe = listenToUsers(async (userList) => {
    await addOrderCounts(userList)
    loading.value = false
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

async function deleteUser(uid) {
  await deleteItem('users', uid, users, 'uid')
}

const filteredUsers = useTableSearch(users, search, ['username', 'email'])
</script>
