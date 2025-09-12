import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => {
    const savedCart = localStorage.getItem('rpm-shop-cart')
    const initialState = savedCart ? JSON.parse(savedCart) : { items: [] }

    return initialState
  },
  actions: {
    addToCart(record) {
      const existing = this.items.find(item => item.id === record.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...record, quantity: 1 })
      }
      this.saveToLocalStorage()
    },
    removeFromCart(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToLocalStorage()
    },
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('rpm-shop-cart', JSON.stringify(this.$state))
    }
  }
})
