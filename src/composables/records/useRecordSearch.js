import { computed } from 'vue'

// Composable for searching, filtering, and sorting records
export function useRecordSearch(records, options = {}) {
  // Options for filtering and sorting
  const {
    tagRef,
    searchRef,
    fields = ['artist', 'album', 'genre'],
    sortBy = 'artist',
    sortDirection = 'asc'
  } = options

  // Computed: filtered and sorted records based on tag and search
  const filteredRecords = computed(() => {
    let baseRecords = records.value

    // Filter by tag/category
    if (tagRef?.value) {
      if (tagRef.value === 'Special Offers') {
        baseRecords = baseRecords.filter(record => Number(record.discount) > 0)
      } else {
        baseRecords = baseRecords.filter(
          record => record.tags && record.tags.includes(tagRef.value)
        )
      }
    }

    // Filter by search string
    if (searchRef?.value) {
      const searchString = searchRef.value.toLowerCase()
      baseRecords = baseRecords.filter(record =>
        fields.some(field =>
          record[field]?.toLowerCase().includes(searchString)
        )
      )
    }

    // Sort records by artist (default)
    baseRecords = [...baseRecords].sort((recordA, recordB) => {
      const artistA = (recordA.artist || '').toLowerCase()
      const artistB = (recordB.artist || '').toLowerCase()
      if (artistA < artistB) return sortDirection === 'asc' ? -1 : 1
      if (artistA > artistB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return baseRecords
  })

  // Returns up to 4 records for a given category/tag
  function recordsByCategory(category) {
    let filteredRecordsByCategory = []
    if (category === 'Special Offers') {
      filteredRecordsByCategory = records.value.filter(record => Number(record.discount) > 0)
    } else {
      filteredRecordsByCategory = records.value.filter(
        record => record.tags && record.tags.includes(category)
      )
    }
    filteredRecordsByCategory = [...filteredRecordsByCategory].sort((recordA, recordB) => {
      const artistA = (recordA.artist || '').toLowerCase()
      const artistB = (recordB.artist || '').toLowerCase()
      if (artistA < artistB) return -1
      if (artistA > artistB) return 1
      return 0
    })
    return filteredRecordsByCategory.slice(0, 4)
  }

  // Expose filtered records and category helper
  return { filteredRecords, recordsByCategory }
}
