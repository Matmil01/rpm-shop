<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <div class="w-full mt-12">
      <h3 class="text-2xl font-headline mb-4">Recent Orders</h3>
      <input
        v-model="search"
        type="text"
        placeholder="Search by order number or customer name..."
        class="mb-4 w-full border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main"
      />
      <div v-if="filteredOrders.length" class="rounded overflow-hidden">
        <table class="w-full table-fixed border-collapse border border-MyYellow font-main text-MyWhite bg-MyBlack">
          <thead>
            <tr class="bg-MyDark text-center text-MyWhite font-main">
              <th class="p-2 border border-MyDark">Order #</th>
              <th class="p-2 border border-MyDark">Customer</th>
              <th class="p-2 border border-MyDark">Total</th>
              <th class="p-2 border border-MyDark w-[120px]">Date</th>
              <th class="p-2 border border-MyDark w-[100px]">Status</th>
              <th class="p-2 border border-MyDark w-[120px]">Actions</th>
              <th class="p-2 border border-MyDark w-[60px]">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="border-t border-MyDark">
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
              <td class="p-2 border border-MyDark align-middle text-center">
                <img
                  src="/icons/trashIcon.svg"
                  alt="Delete"
                  class="w-6 h-6 cursor-pointer hover:opacity-70 transition duration-200 ease-in-out inline-block"
                  @click="confirmDelete(order.id)"
                  title="Delete order"
                />
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
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useOrdersCRUD } from '@/composables/useOrdersCRUD'

const { listenToOrders, updateOrder } = useOrdersCRUD()
const orders = ref([])
const search = ref('')
let unsubscribe = null

onMounted(() => {
  unsubscribe = listenToOrders((orderList) => {
    orders.value = orderList
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const filteredOrders = computed(() => {
  if (!search.value.trim()) return orders.value
  const term = search.value.trim().toLowerCase()
  return orders.value.filter(order =>
    (order.orderNumber && order.orderNumber.toLowerCase().includes(term)) ||
    (order.customer?.name && order.customer.name.toLowerCase().includes(term))
  )
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

async function deleteOrder(id) {
  try {
    await updateOrder(id, { status: 'cancelled' }) // Or implement actual delete if needed
    // Optionally remove from local orders list:
    orders.value = orders.value.filter(order => order.id !== id)
  } catch (error) {
    alert('Error deleting order: ' + error.message)
  }
}

function confirmDelete(id) {
  if (confirm('Are you sure you want to delete this order?')) {
    deleteOrder(id)
  }
}
</script>
