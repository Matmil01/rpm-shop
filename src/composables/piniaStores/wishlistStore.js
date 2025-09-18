import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useUserStore } from './userStore'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),
  actions: {
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
    async saveWishlist() {
      const userStore = useUserStore()
      if (!userStore.uid) return
      const docRef = doc(db, 'users', userStore.uid)
      await updateDoc(docRef, { wishlist: this.items })
    },
    async addToWishlist(record) {
      if (!this.items.find(item => item.id === record.id)) {
        this.items.push({ ...record })
        await this.saveWishlist()
      }
    },
    async removeFromWishlist(id) {
      this.items = this.items.filter(item => item.id !== id)
      await this.saveWishlist()
    }
  }
})
