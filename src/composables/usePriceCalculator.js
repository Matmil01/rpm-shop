import { computed } from 'vue'

export function usePriceCalculator() {
  function calculateDiscountedPrice(price, discount) {
    if (!discount || discount <= 0) return Number(price)
    return Math.round(Number(price) * (1 - Number(discount) / 100))
  }

  function calculateTotalPrice(items) {
    return items.reduce((sum, item) => {
      const price = calculateDiscountedPrice(item.price, item.discount)
      return sum + price * item.quantity
    }, 0)
  }

  return {
    calculateDiscountedPrice,
    calculateTotalPrice
  }
}
