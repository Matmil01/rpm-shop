import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    uid: null,
    username: null,
    email: null,
    role: null,
    profilePic: null, // <-- Add this
    loggedIn: false,
  }),
  actions: {
    setUser(user, role, profilePic = null) {
      this.uid = user.uid
      this.email = user.email
      this.username = user.email ? user.email.split('@')[0] : null
      this.role = role
      this.profilePic = profilePic
      this.loggedIn = true
    },
    clearUser() {
      this.uid = null
      this.email = null
      this.username = null
      this.role = null
      this.profilePic = null
      this.loggedIn = false
    }
  }
})
