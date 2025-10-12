import { computed } from 'vue'

export function useTableSearch(listRef, searchRef, fields = []) {
  return computed(() => {
    if (!searchRef.value.trim()) return listRef.value
    const term = searchRef.value.trim().toLowerCase()
    return listRef.value.filter(item =>
      fields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item)
        return value && value.toString().toLowerCase().includes(term)
      })
    )
  })
}
