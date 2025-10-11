<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-headline mb-4">Order #{{ order?.orderNumber }}</h1>
    <div v-if="loading">Loading order details...</div>
    <div v-else-if="order">
      <div class="mb-6">
        <h2 class="text-xl font-bold mb-2">Customer Information</h2>
        <div>Name: {{ order.customer?.name }}</div>
        <div>Email: {{ order.customer?.email }}</div>
        <div>Username: {{ order.customer?.username }}</div>
        <div>Address: {{ order.customer?.address }}</div>
      </div>
      <div class="mb-6">
        <h2 class="text-xl font-bold mb-2">Order Details</h2>
        <div>Date: {{ order.orderDate?.toDate ? order.orderDate.toDate().toLocaleString() : '' }}</div>
        <div>Status: <span class="px-2 py-1 rounded text-xs"
          :class="{
            'bg-yellow-600': order.status === 'new',
            'bg-blue-600': order.status === 'processing',
            'bg-green-600': order.status === 'shipped',
            'bg-red-600': order.status === 'cancelled'
          }"
        >{{ order.status }}</span></div>
        <div>Total: {{ order.totalAmount }} kr.</div>
      </div>
      <div>
        <h2 class="text-xl font-bold mb-2">Items</h2>
        <table class="w-full border border-MyYellow mb-4">
          <thead>
            <tr>
              <th class="p-2 border border-MyDark">Album</th>
              <th class="p-2 border border-MyDark">Artist</th>
              <th class="p-2 border border-MyDark">Quantity</th>
              <th class="p-2 border border-MyDark">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td class="p-2 border border-MyDark">{{ item.album }}</td>
              <td class="p-2 border border-MyDark">{{ item.artist }}</td>
              <td class="p-2 border border-MyDark">{{ item.quantity }}</td>
              <td class="p-2 border border-MyDark">{{ item.price }} kr.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        @click="$router.back()"
        class="mt-8 text-MyWhite underline hover:opacity-70 ease-in-out duration-200 font-main cursor-pointer"
      >
        ← Back to Orders
      </button>
    </div>
    <div v-else>
      <p>Order not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersCRUD } from '@/composables/useOrdersCRUD'
import { useUserStore } from '@/composables/piniaStores/userStore'

const route = useRoute()
const { fetchAllOrders } = useOrdersCRUD()
const userStore = useUserStore()
const order = ref(null)
const loading = ref(true)

onMounted(async () => {
  const orderNumber = route.params.orderNumber
  const allOrders = await fetchAllOrders()
  if (userStore.role === 'admin') {
    // Admins can see any order
    order.value = allOrders.find(o => String(o.orderNumber) === String(orderNumber))
  } else {
    // Users can only see their own orders
    order.value = allOrders.find(
      o => String(o.orderNumber) === String(orderNumber) && o.customer?.uid === userStore.uid
    )
  }
  loading.value = false
})
</script>
