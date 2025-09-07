import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    addToCart(record) {
      const existing = this.items.find(item => item.id === record.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...record, quantity: 1 })
      }
    },
    removeFromCart(id) {
      this.items = this.items.filter(item => item.id !== id)
    },
    clearCart() {
      this.items = []
    }
  }
})
