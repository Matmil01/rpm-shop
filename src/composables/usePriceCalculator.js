import { computed } from 'vue'

export function usePriceCalculator() {
  /**
   * Udregn pris efter discount
   * @param {Number} price - Original pris
   * @param {Number} discount - Discount %
   * @returns {Number} - Endelig pris efter
   */
  function calculateDiscountedPrice(price, discount) {
    if (!discount || discount <= 0) return Number(price)
    return Math.round(Number(price) * (1 - Number(discount) / 100))
  }

  /**
   * Udregning af samlet pris i cart
   * @param {Array} items - Array med cart indhold + pris, discount og quantity
   * @returns {Number} - Samlet pris
   */
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
