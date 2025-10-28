import { computed } from 'vue'

// Composable for searching/filtering a list by fields
export function useTableSearch(listRef, searchRef, fields = []) {
  // Returns a computed list filtered by search term
  return computed(() => {
    // If search is empty, return full list
    if (!searchRef.value.trim()) return listRef.value
    const term = searchRef.value.trim().toLowerCase()
    // Filter items where any field contains the search term
    return listRef.value.filter(item =>
      fields.some(field => {
        // Support nested fields (e.g. 'customer.name')
        const value = field.split('.').reduce((obj, key) => obj?.[key], item)
        return value && value.toString().toLowerCase().includes(term)
      })
    )
  })
}
