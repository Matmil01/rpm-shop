<template>
  <div class="max-w-3xl mx-auto p-8 text-MyWhite font-main">
    <h1 class="text-2xl font-headline mb-4">Order #{{ order?.orderNumber }}</h1>
    <div v-if="loading">Loading order details...</div>
    <div v-else-if="order">
      <!-- Customer Info -->
      <h2 class="text-xl font-bold mb-2">Customer Information</h2>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow">
        <div><span class="font-bold">Name:</span> {{ order.customer?.name }}</div>
        <div><span class="font-bold">Username:</span> {{ username }}</div>
        <div><span class="font-bold">Address:</span> {{ order.customer?.address }}</div>
        <div><span class="font-bold">Email:</span> {{ order.customer?.email }}</div>
      </div>
      <!-- Order Details -->
      <h2 class="text-xl font-bold mb-2">Order Details</h2>
      <div class="mb-6 p-4 rounded bg-MyDark shadow shadow-MyYellow">
        <div>Date: {{ order.orderDate?.toDate ? order.orderDate.toDate().toLocaleString() : '' }}</div>
        <div>
          Status:
          <span class="px-2 py-1 rounded text-xs"
            :class="getStatusColor(order.status)"
          >{{ getStatusLabel(order.status) }}</span>
        </div>
        <div>Total: {{ order.totalAmount }} kr.</div>
      </div>
      <!-- Items List -->
      <h2 class="text-xl font-bold mb-2">Items</h2>
      <div>
        <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between mb-4 p-4 rounded bg-MyDark shadow shadow-MyYellow gap-4">
          <!-- Image -->
          <img
            v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-20 h-20 object-cover rounded shadow"
          />
          <div v-else class="w-20 h-20 flex items-center justify-center bg-MyDark text-xs rounded">
            No Image
          </div>
          <!-- Details -->
          <div class="flex-1">
            <div class="font-bold truncate">{{ item.album }}</div>
            <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
            <div class="text-sm">
              <span v-if="item.discount && item.discount > 0">
                <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
                <span class="text-MyRed font-bold">{{ calculateDiscountedPrice(item.price, item.discount) }} kr.</span>
              </span>
              <span v-else>
                <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
              </span>
            </div>
            <div class="text-xs mt-1">Qty: {{ item.quantity }}</div>
          </div>
        </div>
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
import { useOrdersCRUD } from '@/composables/CRUD/useOrdersCRUD'
import { useUserStore } from '@/composables/piniaStores/userStore'
import { usePriceCalculator } from '@/composables/records/usePriceCalculator'
import { useOrderStatus } from '@/composables/useOrderStatus'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const { fetchAllOrders } = useOrdersCRUD()
const userStore = useUserStore()
const order = ref(null)
const loading = ref(true)
const { calculateDiscountedPrice } = usePriceCalculator()
const { getStatusLabel, getStatusColor } = useOrderStatus()
const username = ref('')

onMounted(async () => {
  const orderNumber = route.params.orderNumber
  const allOrders = await fetchAllOrders()
  if (userStore.role === 'admin') {
    order.value = allOrders.find(o => String(o.orderNumber) === String(orderNumber))
  } else {
    order.value = allOrders.find(
      o => String(o.orderNumber) === String(orderNumber) && o.customer?.uid === userStore.uid
    )
  }
  // Fetch username from Firestore using customer.uid
  if (order.value?.customer?.uid) {
    const userDoc = await getDoc(doc(db, 'users', order.value.customer.uid))
    if (userDoc.exists()) {
      username.value = userDoc.data().username || ''
    }
  }
  loading.value = false
})
</script>
