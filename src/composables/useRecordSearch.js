import { computed } from 'vue'

export function useRecordSearch(records, options = {}) {
  const {
    tagRef,
    searchRef,
    fields = ['artist', 'album', 'genre'],
    sortBy = 'artist',
    sortDirection = 'asc'
  } = options

  const filteredRecords = computed(() => {
    let baseRecords = records.value

    if (tagRef?.value) {
      if (tagRef.value === 'Special Offers') {
        baseRecords = baseRecords.filter(record => Number(record.discount) > 0)
      } else {
        baseRecords = baseRecords.filter(
          record => record.tags && record.tags.includes(tagRef.value)
        )
      }
    }

    if (searchRef?.value) {
      const searchString = searchRef.value.toLowerCase()
      baseRecords = baseRecords.filter(record =>
        fields.some(field =>
          record[field]?.toLowerCase().includes(searchString)
        )
      )
    }

    baseRecords = [...baseRecords].sort((recordA, recordB) => {
      const artistA = (recordA.artist || '').toLowerCase()
      const artistB = (recordB.artist || '').toLowerCase()
      if (artistA < artistB) return sortDirection === 'asc' ? -1 : 1
      if (artistA > artistB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return baseRecords
  })

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

  return { filteredRecords, recordsByCategory }
}
