import { defineStore } from 'pinia'

// Pinia store for managing the shopping cart state
export const useCartStore = defineStore('cart', {
  // State: initializes cart from localStorage if available
  state: () => {
    const savedCart = localStorage.getItem('rpm-shop-cart')
    const initialState = savedCart ? JSON.parse(savedCart) : { items: [] }

    return initialState
  },
  actions: {
    // Adds a record to the cart (increments quantity if already present)
    addToCart(record) {
      const existing = this.items.find(item => item.id === record.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...record, quantity: 1 })
      }
      this.saveToLocalStorage()
    },
    // Removes a record from the cart by ID
    removeFromCart(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToLocalStorage()
    },
    // Clears all items from the cart
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },
    // Saves the current cart state to localStorage
    saveToLocalStorage() {
      localStorage.setItem('rpm-shop-cart', JSON.stringify(this.$state))
    }
  }
})
