<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <div class="w-full mt-12">
      <h3 class="text-2xl font-headline mb-4">Recent Orders</h3>
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input v-model="search" type="text" placeholder="Search by order number or customer name..."
          class="flex-1 border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main" />
        <select v-model="statusFilter"
          class="border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main w-48">
          <option value="">All Statuses</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div v-if="filteredOrders.length" class="rounded overflow-hidden">
        <table class="w-full table-fixed border-collapse border border-MyYellow font-main text-MyWhite bg-MyBlack">
          <thead>
            <tr class="bg-MyDark text-center text-MyWhite font-main">
              <th class="p-2 border border-MyDark w-[90px]">Order #</th>
              <th class="p-2 border border-MyDark w-[140px]">Customer</th>
              <th class="p-2 border border-MyDark w-[90px]">Total</th>
              <th class="p-2 border border-MyDark w-[120px]">Date</th>
              <th class="p-2 border border-MyDark w-[110px]">Status</th>
              <th class="p-2 border border-MyDark w-[120px]">Actions</th>
              <th class="p-2 border border-MyDark w-[60px]">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="border-t border-MyDark">
              <td class="p-2 border border-MyDark w-[90px]">
                <router-link :to="`/user/orders/${order.orderNumber}`"
                  class="text-MyWhite underline hover:opacity-70 ease-in-out duration-200 font-main">
                  {{ order.orderNumber }}
                </router-link>
              </td>
              <td class="p-2 border border-MyDark w-[140px]">
                {{ order.customer?.name }}
                <span v-if="order.customer?.username" class="text-xs text-gray-400">
                  ({{ order.customer.username }})
                </span>
              </td>
              <td class="p-2 border border-MyDark w-[90px]">{{ order.totalAmount }} kr.</td>
              <td class="p-2 border border-MyDark w-[120px]">{{ order.orderDate?.toDate ?
                order.orderDate.toDate().toLocaleDateString() : '' }}</td>
              <td class="p-2 border border-MyDark w-[110px]">
                <span class="px-2 py-1 rounded text-xs" :class="getStatusColor(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="p-2 border border-MyDark w-[120px]">
                <OrderStatusDropdown v-model="order.status"
                  @update:modelValue="val => handleStatusChange(order.id, val)" class="w-full" />
              </td>
              <td class="p-2 border border-MyDark align-middle text-center w-[60px]">
                <TrashButton title="Delete order" :disabled="false" @click="() => confirmDelete(order.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-MyWhite">No orders yet.</div>
    </div>
    <Snackbar :message="snackbarMessage" :show="snackbarShow" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useOrdersCRUD } from '@/composables/CRUD/useOrdersCRUD'
import { useDeleteItem } from '@/composables/admin/useDeleteItem'
import TrashButton from '@/components/buttons/TrashButton.vue'
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown.vue'
import { useOrderStatus } from '@/composables/admin/useOrderStatus'
import { useTableSearch } from '@/composables/admin/useTableSearch'
import Snackbar from '@/components/Snackbar.vue'

// Snackbar state and helper for notifications
const snackbarMessage = ref('')
const snackbarShow = ref(false)
function showSnackbar(msg) {
  snackbarMessage.value = msg
  snackbarShow.value = true
  setTimeout(() => snackbarShow.value = false, 3000)
}

// CRUD composable for orders
const { listenToOrders, updateOrder } = useOrdersCRUD()
// Delete item composable
const { deleteItem, deletingId, error } = useDeleteItem()
// Order status options and helpers
const { statusOptions, getStatusLabel, getStatusColor } = useOrderStatus()

// Reactive array of orders
const orders = ref([])
// Search input for filtering orders
const search = ref('')
// Status filter for filtering by order status
const statusFilter = ref('')
let unsubscribe = null

// On mount: start listening to orders
onMounted(() => {
  unsubscribe = listenToOrders((orderList) => {
    orders.value = orderList
  })
})

// On unmount: unsubscribe from orders listener
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Computed: searched orders by order number or customer name
const searchedOrders = useTableSearch(orders, search, ['orderNumber', 'customer.name'])

// Computed: filtered orders by status
const filteredOrders = computed(() =>
  statusFilter.value
    ? searchedOrders.value.filter(order => order.status === statusFilter.value)
    : searchedOrders.value
)

// Handles status change for an order
async function handleStatusChange(orderId, newStatus) {
  if (!newStatus) return
  try {
    await updateOrder(orderId, { status: newStatus })
    showSnackbar(`Order status updated!`)
  } catch (error) {
    showSnackbar('Error updating order status: ' + error.message)
  }
}

// Confirm and delete an order from Firestore
async function confirmDelete(id) {
  await deleteItem('orders', id, orders)
}
</script>
