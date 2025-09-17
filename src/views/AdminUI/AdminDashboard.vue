<template>
  <div class="flex flex-col items-center justify-center min-h-[300px] font-main text-MyWhite">
    <div class="w-[900px] mx-auto mt-12">
      <h3 class="text-2xl font-bold mb-4">Recent Orders</h3>
      <div v-if="orders.length">
        <table class="w-full text-left bg-black/40 rounded">
          <thead>
            <tr>
              <th class="p-2">Order #</th>
              <th class="p-2">User</th>
              <th class="p-2">Total</th>
              <th class="p-2">Date</th>
              <th class="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="p-2">{{ order.orderNumber }}</td>
              <td class="p-2">{{ order.customer?.name }}</td>
              <td class="p-2">{{ order.totalAmount }} kr.</td>
              <td class="p-2">{{ order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : '' }}</td>
              <td class="p-2">
                <select
                  :value="order.status"
                  @change="handleStatusChange(order.id, $event.target.value)"
                  class="bg-black text-MyWhite border rounded px-2 py-1"
                >
                  <option v-for="status in statusOptions" :key="status" :value="status">
                    {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-gray-400">No orders yet.</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'

const { listenToOrders, updateOrderStatus } = useFirestoreCRUD()
const orders = ref([])
let unsubscribe = null

const statusOptions = ['new', 'processing', 'shipped', 'completed', 'cancelled']

function handleStatusChange(orderId, newStatus) {
  updateOrderStatus(orderId, newStatus)
}

onMounted(() => {
  unsubscribe = listenToOrders((orderList) => {
    orders.value = orderList
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
