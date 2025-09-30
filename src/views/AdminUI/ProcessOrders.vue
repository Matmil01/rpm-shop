<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <div class="w-full mt-12">
      <h3 class="text-2xl font-headline mb-4">Recent Orders</h3>
      <div v-if="orders.length" class="rounded overflow-hidden">
        <table class="w-full table-fixed border-collapse border border-MyYellow font-main text-MyWhite bg-MyBlack">
          <thead>
            <tr class="bg-MyDark text-left text-MyWhite font-main">
              <th class="p-2 border border-MyDark min-w-0">Order #</th>
              <th class="p-2 border border-MyDark min-w-0">Customer</th>
              <th class="p-2 border border-MyDark min-w-0">Total</th>
              <th class="p-2 border border-MyDark min-w-0">Date</th>
              <th class="p-2 border border-MyDark min-w-0">Status</th>
              <th class="p-2 border border-MyDark min-w-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-t border-MyDark">
              <td class="p-2 border border-MyDark">{{ order.orderNumber }}</td>
              <td class="p-2 border border-MyDark">
                {{ order.customer?.name }}
                <span v-if="order.customer?.username" class="text-xs text-gray-400">
                  ({{ order.customer.username }})
                </span>
              </td>
              <td class="p-2 border border-MyDark">{{ order.totalAmount }} kr.</td>
              <td class="p-2 border border-MyDark">{{ order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : '' }}</td>
              <td class="p-2 border border-MyDark">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="{
                    'bg-yellow-600': order.status === 'new',
                    'bg-blue-600': order.status === 'processing',
                    'bg-green-600': order.status === 'shipped',
                    'bg-red-600': order.status === 'cancelled'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="p-2 border border-MyDark">
                <select
                  @change="handleStatusChange(order.id, $event.target.value)"
                  class="bg-gray-800 text-MyWhite rounded px-2 py-1 text-xs cursor-pointer"
                >
                  <option
                    value=""
                    :selected="order.status === 'new'"
                    disabled
                  >
                    Select action
                  </option>
                  <option
                    value="processing"
                    :selected="order.status === 'processing'"
                  >
                    Processing
                  </option>
                  <option
                    value="shipped"
                    :selected="order.status === 'shipped'"
                  >
                    Shipped
                  </option>
                  <option
                    value="cancelled"
                    :selected="order.status === 'cancelled'"
                  >
                    Cancelled
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-MyWhite">No orders yet.</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useFirestoreCRUD } from '@/composables/useFirestoreCRUD'

const { listenToOrders, updateOrder } = useFirestoreCRUD()
const orders = ref([])
let unsubscribe = null

onMounted(() => {
  unsubscribe = listenToOrders((orderList) => {
    orders.value = orderList
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

async function handleStatusChange(orderId, newStatus) {
  if (!newStatus) return
  try {
    await updateOrder(orderId, { status: newStatus })
    console.log(`Order ${orderId} status updated to ${newStatus}`)
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}
</script>
