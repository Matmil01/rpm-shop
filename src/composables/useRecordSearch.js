import { computed } from 'vue'

export function useRecordSearch(records, options = {}) {
  const { tagRef, searchRef, fields = ['artist', 'album', 'genre'], sortBy = 'artist', sortDirection = 'asc' } = options

  const filteredRecords = computed(() => {
    let base = records.value

    if (tagRef?.value) {
      if (tagRef.value === 'Special Offers') {
        base = base.filter(r => Number(r.discount) > 0)
      } else {
        base = base.filter(r => r.tags && r.tags.includes(tagRef.value))
      }
    }

    if (searchRef?.value) {
      const s = searchRef.value.toLowerCase()
      base = base.filter(r =>
        fields.some(field =>
          r[field]?.toLowerCase().includes(s)
        )
      )
    }

    base = [...base].sort((a, b) => {
      const aVal = (a.artist || '').toLowerCase()
      const bVal = (b.artist || '').toLowerCase()
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return base
  })

  function recordsByCategory(category) {
    let filtered = []
    if (category === 'Special Offers') {
      filtered = records.value.filter(r => Number(r.discount) > 0)
    } else {
      filtered = records.value.filter(r => r.tags && r.tags.includes(category))
    }
    filtered = [...filtered].sort((a, b) => {
      const aVal = (a.artist || '').toLowerCase()
      const bVal = (b.artist || '').toLowerCase()
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
      return 0
    })
    return filtered.slice(0, 4)
  }

  return { filteredRecords, recordsByCategory }
}
