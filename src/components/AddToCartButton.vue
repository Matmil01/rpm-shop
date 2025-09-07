<template>
  <button
    type="button"
    @click="handleAdd"
    :disabled="loading"
    class="flex items-center gap-2 px-3 py-2 rounded border border-white/40 bg-black/30 backdrop-blur-sm cursor-pointer relative transition-opacity duration-150 hover:opacity-80"
  >
    <span v-if="item.discount && item.discount > 0">
      <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
      <span class="text-red-600 font-bold">{{ discountedPrice }} kr.</span>
    </span>
    <span v-else>
      <span class="text-gray-200 font-bold">{{ item.price }} kr.</span>
    </span>
    <span class="text-MyWhite text-xl">🛒</span>
    <span v-if="showAdded" class="absolute right-2 top-2 text-green-400 text-xs font-bold animate-pulse">✓</span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()
const loading = ref(false)
const showAdded = ref(false)

const discountedPrice = computed(() => {
  if (!props.item.discount || props.item.discount <= 0) return props.item.price
  return Math.round(props.item.price * (1 - props.item.discount / 100))
})

function handleAdd() {
  loading.value = true
  cart.addToCart(props.item)
  showAdded.value = true
  setTimeout(() => {
    showAdded.value = false
    loading.value = false
  }, 1000)
}
</script>
