<template>
  <div class="max-w-3xl mx-auto p-8 text-center text-MyWhite font-main">
    <h2 class="text-2xl font-bold mb-8">Registered Users</h2>
    <div v-if="loading" class="text-gray-400 mb-4">Loading users...</div>
    <table v-if="users.length" class="w-full text-left bg-black/40 rounded font-main text-MyWhite">
      <thead>
        <tr>
          <th class="p-2 border-b border-gray-600">Username</th>
          <th class="p-2 border-b border-gray-600">Email</th>
          <th class="p-2 border-b border-gray-600">Role</th>
          <th class="p-2 border-b border-gray-600">Orders</th>
          <th class="p-2 border-b border-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.uid" class="border-b border-gray-700">
          <td class="p-2">{{ user.username }}</td>
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2">{{ user.role }}</td>
          <td class="p-2">{{ user.orderCount || 0 }}</td>
          <td class="p-2">
            <button
              v-if="user.uid !== currentAdminUid"
              @click="deleteUser(user.uid)"
              class="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-900 transition font-main cursor-pointer"
              :disabled="deleting === user.uid"
            >
              <span v-if="deleting === user.uid">Deleting...</span>
              <span v-else>Ban</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="!loading" class="text-gray-400">No users found.</div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db, } from '@/firebase'
import { query, collection, getDocs, where, deleteDoc, doc } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'

const users = ref([])
const loading = ref(true)
const deleting = ref(null)
const error = ref('')
const userStore = useUserStore()
const currentAdminUid = userStore.uid

const { listenToUsers } = useFirestoreCRUD()
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
  if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return
  deleting.value = uid
  error.value = ''
  try {
    await deleteDoc(doc(db, 'users', uid))
    users.value = users.value.filter(u => u.uid !== uid)
  } catch (e) {
    error.value = 'Failed to delete user.'
  }
  deleting.value = null
}
</script>
