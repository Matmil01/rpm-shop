<template>
  <div class="max-w-4xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-headline mb-6">Order History</h1>
    <div v-if="loading" class="mb-4">Loading orders...</div>
    <div v-else-if="orders.length">
      <table class="w-full table-fixed border-collapse border border-MyDark bg-MyBlack">
        <thead>
          <tr>
            <th class="p-2 bg-MyDark">Order #</th>
            <th class="p-2 bg-MyDark">Date</th>
            <th class="p-2 bg-MyDark">Total</th>
            <th class="p-2 bg-MyDark">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="p-2 border border-MyDark">
              <router-link :to="`/user/orders/${order.orderNumber}`"
                class="text-MyWhite underline hover:opacity-70 duration-200 ease-in-out font-main">
                {{ order.orderNumber }}
              </router-link>
            </td>
            <td class="p-2 border border-MyDark">{{ order.orderDate?.toDate ?
              order.orderDate.toDate().toLocaleDateString() : '' }}</td>
            <td class="p-2 border border-MyDark">{{ order.totalAmount }} kr.</td>
            <td class="p-2 border border-MyDark">
              <span class="px-2 py-1 rounded text-xs" :class="getStatusColor(order.status)">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>You have no orders yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// CRUD composable for listening to orders collection
import { useOrdersCRUD } from '@/composables/CRUD/useOrdersCRUD'
// Pinia store for current user info
import { useUserStore } from '@/composables/piniaStores/userStore'
// Composable for order status labels/colors
import { useOrderStatus } from '@/composables/admin/useOrderStatus'

// Orders CRUD composable
const { listenToOrders } = useOrdersCRUD()
// User store for current user info
const userStore = useUserStore()
// Order status helpers
const { getStatusLabel, getStatusColor } = useOrderStatus()
// Reactive array of orders
const orders = ref([])
// Loading state for async fetch
const loading = ref(true)

// On mount: listen to only this user's orders
onMounted(() => {
  if (!userStore.uid) return
  // Listen to orders and filter for current user
  const unsubscribe = listenToOrders((orderList) => {
    orders.value = orderList.filter(order => order.customer?.uid === userStore.uid)
    loading.value = false
  })
})
</script>
