<template>
  <button
    type="button"
    @click="handleAdd"
    :disabled="loading"
    class="flex items-center gap-2 px-3 py-2 rounded border border-MyDark bg-MyBlack/30 backdrop-blur-sm cursor-pointer relative transition-opacity duration-150 hover:opacity-80"
  >
    <span v-if="item.discount && item.discount > 0">
      <span class="line-through text-gray-400 mr-2">{{ item.price }} kr.</span>
      <span class="text-MyRed font-bold">{{ discountedPrice }} kr.</span>
    </span>
    <span v-else>
      <span class="text-MyWhite font-bold">{{ item.price }} kr.</span>
    </span>
    <img
      src="/Icons/cartIcon.svg"
      alt="Add to Cart"
      class="w-5 h-5 opacity-60"
    />
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/composables/piniaStores/cartStore'
import { usePriceCalculator } from '@/composables/usePriceCalculator'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()

const { calculateDiscountedPrice } = usePriceCalculator()
const discountedPrice = computed(() =>
  calculateDiscountedPrice(props.item.price, props.item.discount)
)

function handleAdd() {
  cart.addToCart(props.item)
}
</script>
