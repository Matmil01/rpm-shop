<template>
  <div class="max-w-7xl mx-auto mt-10 p-6 rounded shadow font-main text-MyWhite">
    <div class="w-full mt-12">
      <h3 class="text-2xl font-headline mb-4">Recent Orders</h3>
      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search by order number or customer name..."
          class="flex-1 border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main"
        />
        <select
          v-model="statusFilter"
          class="border border-MyYellow rounded-full bg-MyDark px-3 py-2 text-MyWhite font-main w-48"
        >
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
                <router-link
                  :to="`/user/orders/${order.orderNumber}`"
                  class="text-MyWhite underline hover:opacity-70 ease-in-out duration-200 font-main"
                >
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
              <td class="p-2 border border-MyDark w-[120px]">{{ order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : '' }}</td>
              <td class="p-2 border border-MyDark w-[110px]">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="getStatusColor(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="p-2 border border-MyDark w-[120px]">
                <OrderStatusDropdown
                  v-model="order.status"
                  @update:modelValue="val => handleStatusChange(order.id, val)"
                  class="w-full"
                />
              </td>
              <td class="p-2 border border-MyDark align-middle text-center w-[60px]">
                <TrashButton
                  title="Delete order"
                  :disabled="false"
                  @click="() => confirmDelete(order.id)"
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
import { useOrdersCRUD } from '@/composables/CRUD/useOrdersCRUD'
import { useDeleteItem } from '@/composables/admin/useDeleteItem'
import TrashButton from '@/components/buttons/TrashButton.vue'
import OrderStatusDropdown from '@/components/admin/OrderStatusDropdown.vue'
import { useOrderStatus } from '@/composables/admin/useOrderStatus'
import { useTableSearch } from '@/composables/admin/useTableSearch'

const { listenToOrders, updateOrder } = useOrdersCRUD()
const { deleteItem, deletingId, error } = useDeleteItem()
const { statusOptions, getStatusLabel, getStatusColor } = useOrderStatus()

const orders = ref([])
const search = ref('')
const statusFilter = ref('')
let unsubscribe = null

onMounted(() => {
  unsubscribe = listenToOrders((orderList) => {
    orders.value = orderList
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const searchedOrders = useTableSearch(orders, search, ['orderNumber', 'customer.name'])

const filteredOrders = computed(() =>
  statusFilter.value
    ? searchedOrders.value.filter(order => order.status === statusFilter.value)
    : searchedOrders.value
)

async function handleStatusChange(orderId, newStatus) {
  if (!newStatus) return
  try {
    await updateOrder(orderId, { status: newStatus })
    console.log(`Order ${orderId} status updated to ${newStatus}`)
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

async function confirmDelete(id) {
  await deleteItem('orders', id, orders)
}
</script>
