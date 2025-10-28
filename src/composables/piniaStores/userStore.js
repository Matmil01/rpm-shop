import { defineStore } from 'pinia'

// Pinia store for managing user authentication and profile state
export const useUserStore = defineStore('user', {
  // State: user info and login status
  state: () => ({
    uid: null,
    username: null,
    email: null,
    role: null,
    profilePic: null,
    loggedIn: false,
  }),
  actions: {
    // Sets user info after login or registration
    setUser(user, role, profilePic = null, username = null) {
      this.uid = user.uid
      this.email = user.email
      // Use provided username or derive from email
      this.username = username || (user.email ? user.email.split('@')[0] : null)
      this.role = role
      // Use provided profilePic, user's photoURL, or null
      this.profilePic = profilePic ?? user.photoURL ?? null
      this.loggedIn = true
    },
    // Clears user info on logout
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
