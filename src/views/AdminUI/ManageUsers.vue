<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <h2 class="text-2xl font-headline mb-8">Registered Users</h2>
    <div v-if="loading" class="text-MyWhite mb-4">Loading users...</div>

    <div v-if="users.length" class="rounded overflow-hidden">
      <table class="w-full border-collapse border border-MyDark table-auto font-main text-MyWhite bg-MyBlack">
        <thead>
          <tr class="bg-MyDark text-left text-MyWhite font-main">
            <th class="p-2 border border-MyDark">Username</th>
            <th class="p-2 border border-MyDark">Email</th>
            <th class="p-2 border border-MyDark">Role</th>
            <th class="p-2 border border-MyDark">Orders</th>
            <th class="p-2 border border-MyDark">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uid" class="border-t border-MyDark">
            <td class="p-2 border border-MyDark">{{ user.username }}</td>
            <td class="p-2 border border-MyDark">{{ user.email }}</td>
            <td class="p-2 border border-MyDark">{{ user.role }}</td>
            <td class="p-2 border border-MyDark">{{ user.orderCount || 0 }}</td>
            <td class="p-2 border border-MyDark">
              <button
                v-if="user.uid !== currentAdminUid"
                @click="deleteUser(user.uid)"
                class="bg-MyRed text-MyWhite px-3 py-1 rounded hover:opacity-70 transition font-main cursor-pointer"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { db, } from '@/firebase'
import { query, collection, getDocs, where, deleteDoc, doc } from 'firebase/firestore'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { useUsersCRUD } from '@/composables/useUsersCRUD'

const users = ref([])
const loading = ref(true)
const deleting = ref(null)
const error = ref('')
const userStore = useUserStore()
const currentAdminUid = userStore.uid

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
  if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return
  deleting.value = uid
  error.value = ''
  try {
    await deleteDoc(doc(db, 'users', uid))
    users.value = users.value.filter(u => u.uid !== uid)
  } catch (error) {
    error.value = 'Failed to delete user.'
  }
  deleting.value = null
}
</script>
