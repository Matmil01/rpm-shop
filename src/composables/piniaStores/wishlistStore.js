import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useUserStore } from './userStore'

// Pinia store for managing the user's wishlist
export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] // Array of wishlist items
  }),
  actions: {
    // Loads wishlist from Firestore for the current user
    async loadWishlist() {
      const userStore = useUserStore()
      if (!userStore.uid) return
      const docRef = doc(db, 'users', userStore.uid)
      const userDoc = await getDoc(docRef)
      if (userDoc.exists() && userDoc.data().wishlist) {
        this.items = userDoc.data().wishlist
      } else {
        this.items = []
      }
    },
    // Saves the current wishlist to Firestore for the current user
    async saveWishlist() {
      const userStore = useUserStore()
      if (!userStore.uid) return
      const docRef = doc(db, 'users', userStore.uid)
      await updateDoc(docRef, { wishlist: this.items })
    },
    // Adds a record to the wishlist if not already present
    async addToWishlist(record) {
      if (!this.items.find(item => item.id === record.id)) {
        this.items.push({ ...record })
        await this.saveWishlist()
      }
    },
    // Removes a record from the wishlist by ID
    async removeFromWishlist(id) {
      this.items = this.items.filter(item => item.id !== id)
      await this.saveWishlist()
    }
  }
})
