<template>
  <div class="flex flex-col items-center justify-center min-h-[300px] font-main text-MyWhite">
    <h2 class="text-3xl font-bold mb-4 pt-10">Hello, Admin</h2>
    <p class="mb-6 text-lg text-MyWhite">Use this interface to add new records, manage the storefront, and steal people's money. Hail Satan.</p>

    <div class="w-full max-w-4xl mt-12">
      <h3 class="text-2xl font-bold mb-4">Recent Orders</h3>
      <div v-if="orders.length" class="rounded overflow-hidden">
        <table class="w-full border-collapse border border-MyDark table-auto font-main text-MyWhite bg-MyBlack">
          <thead>
            <tr class="bg-gray-900 text-left text-MyWhite font-main">
              <th class="p-2 border border-MyDark">Order #</th>
              <th class="p-2 border border-MyDark">Customer</th>
              <th class="p-2 border border-MyDark">Total</th>
              <th class="p-2 border border-MyDark">Date</th>
              <th class="p-2 border border-MyDark">Status</th>
              <th class="p-2 border border-MyDark">Actions</th>
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
