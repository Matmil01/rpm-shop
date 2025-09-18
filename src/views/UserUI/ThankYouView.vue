<template>
  <div class="max-w-3xl mx-auto p-8 text-center text-MyWhite font-main">
    <div class="mb-8 p-8 bg-black/40 rounded">
      <h1 class="text-4xl font-bold mb-8">
        Thank You{{ orderData?.customer?.name ? `, ${orderData.customer.name}` : '' }}!
      </h1>

      <div class="text-5xl mb-6">🎸</div>
      <p class="text-xl mb-6">If this was a real webshop, now is when I'd be taking your money.</p>

      <div class="mb-8 p-4 bg-gray-800/50 rounded inline-block">
        <div class="text-left">
          <div class="mb-2">Order #: {{ orderNumber }}</div>
          <div class="mb-2">
            Name: {{ orderData?.customer?.name }}
            <span v-if="orderData?.customer?.username" class="text-xs text-gray-400">({{ orderData.customer.username }})</span>
          </div>
          <div class="mb-2">Address: {{ orderData?.customer?.address }}</div>
          <div class="text-sm text-gray-400">Date: {{ new Date().toLocaleDateString() }}</div>
        </div>
      </div>

      <div v-if="orderItems.length" class="mb-8 text-left">
        <h2 class="font-bold mb-4 text-xl">Order Summary</h2>
        <div v-for="item in orderItems" :key="item.id" class="flex items-center justify-between mb-4 p-4 rounded bg-black/40 gap-4">
          <img
            v-if="item.coverImage"
            :src="item.coverImage"
            alt="Cover"
            class="w-20 h-20 object-cover rounded shadow"
          />
          <div v-else class="w-20 h-20 flex items-center justify-center bg-gray-700 text-xs rounded">
            No Image
          </div>
          <div class="flex-1">
            <div class="font-bold truncate">{{ item.album }}</div>
            <div class="text-sm mb-1 truncate">{{ item.artist }}</div>
            <div class="text-sm">
              <span v-if="item.discount && item.discount > 0">
                <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
                <span class="text-red-600 font-bold">{{ item.finalPrice }} kr.</span>
              </span>
              <span v-else>
                <span class="text-gray-200 font-bold">{{ item.finalPrice }} kr.</span>
              </span>
            </div>
            <div class="text-xs mt-1">Qty: {{ item.quantity }}</div>
          </div>
        </div>
        <div class="text-right font-bold text-xl mt-4">
          Total: {{ orderTotal }} kr.
        </div>
      </div>

      <div class="mt-8">
        <router-link to="/" class="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-900 inline-block">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'

const route = useRoute()
const { fetchOrderByNumber } = useFirestoreCRUD()

const orderNumber = computed(() =>
  route.query.orderNumber || `RPM-${Math.floor(100000 + Math.random() * 900000)}`
)

const orderData = ref(null) // <-- Add this
const orderItems = ref([])
const orderTotal = ref(0)
const isLoading = ref(true)

onMounted(async () => {
  if (orderNumber.value) {
    try {
      const fetchedOrder = await fetchOrderByNumber(orderNumber.value)
      if (fetchedOrder) {
        orderData.value = fetchedOrder // <-- Store the whole order
        orderItems.value = fetchedOrder.items || []
        orderTotal.value = fetchedOrder.totalAmount || 0
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>
