import { ref } from "vue"

export function useDiscogsSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchAlbums = async (query, page = 1) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(
        `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&format=vinyl&page=${page}&token=${import.meta.env.VITE_DISCOGS_TOKEN}`
      )
      const data = await res.json()
      results.value = data.results
    } catch (err) {
      error.value = err.message || "Error occurred while searching Discogs."
    } finally {
      loading.value = false
    }
  }

  const fetchReleaseDetails = async (releaseId) => {
    try {
      const res = await fetch(
        `https://api.discogs.com/releases/${releaseId}?token=${import.meta.env.VITE_DISCOGS_TOKEN}`
      )
      if (!res.ok) throw new Error("Failed to fetch release details")
      return await res.json()
    } catch (err) {
      error.value = err.message || "An error occurred while fetching release details."
      return null
    }
  }

  const clearResults = () => {
    results.value = []
    error.value = null
  }

  return { results, loading, error, searchAlbums, fetchReleaseDetails, clearResults }
}
